// navbar.js
import { supabase } from './supabase-client.js'

function initNavbar(root) {
    const logo = root.querySelector('.logo');
    const hamburger = root.querySelector('.hamburger');
    const navRight = root.querySelector('.nav-right'); // Mobile menu container
    const logoText = logo?.querySelector('span'); // Optional chaining for safety

    if (!hamburger || !navRight) return;
    
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (logo && isIndexPage) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollToTop();
        });
    }
    
    const navLinks = navRight.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Only apply logo text animation if logoText element exists
    if (logoText) {
        // Initialize logo text state
        logoText.classList.add('hide');
        logoText.classList.remove('show');
        
        function updateLogoTextVisibility() {
            const shouldShow = window.scrollY > 50;
            if (shouldShow && !logoText.classList.contains('show')) {
                logoText.classList.add('show');
                logoText.classList.remove('hide');
            } else if (!shouldShow && logoText.classList.contains('show')) {
                logoText.classList.add('hide');
                logoText.classList.remove('show');
            }
        }
        updateLogoTextVisibility(); // Initial check
        window.addEventListener('scroll', updateLogoTextVisibility);
    }

    function smoothScrollToTop() {
        const current = window.pageYOffset;
        const duration = 500;
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
        hamburger.classList.add('open');
    }

    function closeMenu() {
        navRight.classList.remove('active');
        hamburger.classList.remove('open');
    }

    function toggleMenu() {
        if (navRight.classList.contains('active')) closeMenu();
        else openMenu();
    }

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', e => {
        if (!root.contains(e.target)) closeMenu();
    });
}

async function initUserIcon(root) {
    const userIcon = root.querySelector('.user-icon');
    if (!userIcon) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle()
            
        let username = profile?.username;

        if (!username && session.user.user_metadata?.username) {
            username = session.user.user_metadata.username;
        }
        
        username = username || 'Usuari';
        
        userIcon.href = 'profile.html';
        userIcon.setAttribute('aria-label', 'Profile');
        userIcon.innerHTML = `<span class="nav-username">${username}</span>`;
    } else {
        userIcon.href = 'login.html';
        userIcon.setAttribute('aria-label', 'Login');
        userIcon.innerHTML = '<span class="nav-username">Login</span>';
    }
}

fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById('navbar');
        container.innerHTML = html;
        initNavbar(container);
        initUserIcon(container); // No need to await here, can run concurrently
    })