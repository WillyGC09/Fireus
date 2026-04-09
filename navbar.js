function initNavbar(root) {
    const logo = root.querySelector('.logo');
    const hamburger = root.querySelector('.hamburger');
    const navRight = root.querySelector('.nav-right');
    const logoText = logo ? logo.querySelector('span') : null;

    if (!hamburger || !navRight) return;

    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (logo && isIndexPage) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollToTop();
        });
    }

    // Handle logo text visibility on scroll
    let lastScrollY = window.scrollY;
    let isTextVisible = false;

    function updateLogoText() {
        const currentScrollY = window.scrollY;
        const shouldShow = currentScrollY > 50; // Show when scrolled down more than 50px

        if (shouldShow && !isTextVisible) {
            // Show text with slide-in from right
            logoText.classList.add('show');
            logoText.classList.remove('hide');
            isTextVisible = true;
        } else if (!shouldShow && isTextVisible) {
            // Hide text with slide-out to left
            logoText.classList.add('hide');
            logoText.classList.remove('show');
            isTextVisible = false;
        }

        lastScrollY = currentScrollY;
    }

    // Initial check
    updateLogoText();

    // Listen for scroll events
    window.addEventListener('scroll', updateLogoText);

    function smoothScrollToTop() {
        const current = window.pageYOffset;
        const duration = 600; // ms
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            const ease = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, current * (1 - ease));

            if (progress < 1) {
            requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function openMenu() {
        navRight.classList.add('active');
        hamburger.classList.add('open');
    }

    function closeMenu() {
        navRight.classList.remove('active');
        hamburger.classList.remove('open');
    }

    function toggleMenu() {
        if (navRight.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', e => {
        if (!root.contains(e.target)) {
            closeMenu();
        }
    });
}

fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById('navbar');
        container.innerHTML = html;
        initNavbar(container);
    })