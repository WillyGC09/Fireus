// navbar.js
import { supabase } from './supabase-client.js'

function initNavbar(root) {
    const logo = root.querySelector('.logo');
    const hamburger = root.querySelector('.hamburger');
    const navRight = root.querySelector('.nav-right');
    const logoText = logo?.querySelector('span');

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
    
    if (logoText) {
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
        updateLogoTextVisibility();
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
        
        username = username || 'User';
        
        userIcon.href = 'profile.html';
        userIcon.setAttribute('aria-label', 'Profile');
        userIcon.innerHTML = `<span class="nav-username">${username}</span>`;
    } else {
        userIcon.href = 'login.html';
        userIcon.setAttribute('aria-label', 'Login');
        userIcon.innerHTML = '<span class="nav-username">Login</span>';
    }
}

function initSearch(root) {
    const topNav = root.querySelector('.nav-right-top');
    if (!topNav) return;

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper';
    searchWrapper.innerHTML = `
        <button class="search-btn" id="search-toggle" aria-label="Search">⌕</button>
        <div id="search-input-container">
            <input type="text" class="search-input" id="search-query" placeholder="Search games or users">
            <div class="search-results" id="search-results"></div>
        </div>
    `;
    topNav.appendChild(searchWrapper);

    const userIcon = topNav.querySelector('.user-icon');
    if (userIcon) {
        topNav.insertBefore(searchWrapper, userIcon);
    }

    const toggle = root.querySelector('#search-toggle');
    const container = root.querySelector('#search-input-container');
    const input = root.querySelector('#search-query');
    const results = root.querySelector('#search-results');

    const GAMES = [
        { name: "Depths of Death", url: "depths-of-death.html", type: "game" }
    ];

    toggle.onclick = (e) => {
        e.stopPropagation();
        const isVisible = container.style.display === 'flex';
        container.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) input.focus();
    };

    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) container.style.display = 'none';
    });

    input.oninput = async () => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
            results.innerHTML = '';
            return;
        }

        const matchedGames = GAMES.filter(g => g.name.toLowerCase().includes(query));
        
        const { data: matchedUsers } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .ilike('username', `%${query}%`)
            .limit(5);

        let html = matchedGames.map(g => `
            <a href="${g.url}" class="search-item" onclick="document.getElementById('search-input-container').style.display='none';">
                <strong>${g.name}</strong>
            </a>
        `).join('');

        if (matchedUsers) {
            html += matchedUsers.map(u => `
                <a href="profile.html?u=${u.username}" class="search-item">
                    <img src="${u.avatar_url || 'fireus.png'}" alt="">
                    <span>${u.username}</span> 
                </a>
            `).join('');
        }

        results.innerHTML = html || '<div class="search-item">No results found</div>';
    };
}

fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById('navbar');
        container.innerHTML = html;
        initNavbar(container);
        initUserIcon(container);
        initSearch(container);
    })