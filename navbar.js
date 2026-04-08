// navbar.js

function initNavbar(root) {
    const hamburger = root.querySelector('.hamburger');
    const navRight = root.querySelector('.nav-right');
    const logo = root.querySelector('.logo');

    if (!hamburger || !navRight) return;

    function openMenu() {
        navRight.classList.add('active');
        hamburger.classList.add('open');  // per al CSS de "X"
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

  // Click a la hamburguesa
    hamburger.addEventListener('click', toggleMenu);

  // Teclat a la hamburguesa
    hamburger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

  // Tancar si cliques fora
    document.addEventListener('click', e => {
        if (!root.contains(e.target)) {
      // si el clic NO és dins la navbar
            closeMenu();
        }
    });

  // Logo: scroll amunt (opcional)
    if (logo) {
        logo.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// Carregar el HTML i inicialitzar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById('navbar');
        container.innerHTML = html;
        initNavbar(container);
    })