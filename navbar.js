// navbar.js

function initNavbar(root) {
    const logo = root.querySelector('.logo');
    const menuToggle = root.querySelector('.menu-toggle');
    const navRight = root.querySelector('.nav-right');
    const logoText = logo ? logo.querySelector('span') : null;

    if (!menuToggle || !navRight) return;

    const isIndexPage =
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname === '/Fireus/' ||
        window.location.pathname === '/Fireus/index.html';

    if (logo && isIndexPage) {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollToTop();
        });
    }

    if (logoText && isIndexPage) {
        let isTextVisible = false;

        function updateLogoText() {
            const currentScrollY = window.scrollY;
            const shouldShow = currentScrollY > 50;

            if (shouldShow && !isTextVisible) {
                logoText.classList.add('show');
                logoText.classList.remove('hide');
                isTextVisible = true;
            } else if (!shouldShow && isTextVisible) {
                logoText.classList.add('hide');
                logoText.classList.remove('show');
                isTextVisible = false;
            }
        }

        // Estado inicial: oculto
        logoText.classList.add('hide');
        logoText.classList.remove('show');

        updateLogoText();
        window.addEventListener('scroll', updateLogoText);
    }

    // ---- SCROLL SUAVE ARRIBA ----
    function smoothScrollToTop() {
        const current = window.pageYOffset;
        const duration = 600;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, current * (1 - ease));
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    function openMenu() {
        navRight.classList.add('active');
        menuToggle.classList.add('open');          // rota flecha
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        navRight.classList.remove('active');
        menuToggle.classList.remove('open');       // rota flecha
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
        if (navRight.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    const navLinks = navRight.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', e => {
        if (!root.contains(e.target)) {
            closeMenu();
        }
    });
}

(function () {
    const navbarRoot = document.getElementById('navbar');
    if (!navbarRoot) return;

    navbarRoot.innerHTML = `
    <nav>
        <a class="logo" href="index.html" aria-label="Go back to home">
            <img src="fireus.png" alt="Fireus Logo">
            <span>Fireus Games</span>
        </a>
        <div class="nav-right">
            <button class="menu-toggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="navbar-links">
                <span class="arrow"></span>
            </button>
            <ul id="navbar-links" class="nav-links">
                <li><a href="index.html#games">Games</a></li>
                <li><a href="index.html#what-weve-done">What We've Done</a></li>
                <li><a href="colabora.html">Collaborate</a></li>
            </ul>
        </div>
    </nav>
    `;

    initNavbar(navbarRoot);
})();