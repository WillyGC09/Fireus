import { supabase } from './supabase-client.js';

async function loadProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUsername = urlParams.get('u');
    const { data: { session } } = await supabase.auth.getSession();
    
    let userId = session?.user?.id;
    let isOwnProfile = true;

    if (targetUsername) {
        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('username', targetUsername)
            .maybeSingle();

        if (!targetProfile) {
            document.getElementById('display-username').innerText = "User not found";
            document.title = "User not found - Fireus Games";
            return;
        }
        userId = targetProfile.id;
        isOwnProfile = (session?.user?.id === userId);

        if (!isOwnProfile) document.title = `${targetProfile.username} - Fireus Games`;
    } else if (!session) {
        window.location.href = 'login.html';
        return;
    }

    if (!isOwnProfile) {
        document.querySelector('a[href="settings.html"]').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('display-email').style.display = 'none';
    } else {
        document.getElementById('display-email').innerText = session.user.email;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .maybeSingle();

    if (profile) {
        document.getElementById('display-username').innerText = profile.username || "Error loading name";
        if (profile.avatar_url) document.getElementById('display-avatar').src = profile.avatar_url;

        const { data: stats } = await supabase
            .from('game_stats')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (stats && stats.is_connected) {
            document.getElementById('stats-container').style.display = 'block';
            document.getElementById('no-stats-message').style.display = 'none';
            
            const statsGrid = document.getElementById('stats-grid');
            const displayConfig = [
                { label: 'Level', value: stats.level },
                { label: 'Hours Played', value: Math.floor(stats.hours_played) },
                { label: 'Matches', value: stats.matches_played }
            ];

            statsGrid.innerHTML = displayConfig.map(s => `
                <div>
                    <span style="color: #888; font-size: 0.8em;">${s.label}</span>
                    <div style="font-size: 1.2em; font-weight: bold; color: #fff;">${s.value}</div>
                </div>
            `).join('');
        }
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

loadProfile();