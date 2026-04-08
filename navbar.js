function initNavbar(root) {
    const hamburger = root.querySelector('.hamburger');
    const navRight = root.querySelector('.nav-right');
    const logo = root.querySelector('.logo');

    if (!hamburger || !navRight) return;

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

    if (logo) {
        logo.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById('navbar');
        container.innerHTML = html;
        initNavbar(container);
    })