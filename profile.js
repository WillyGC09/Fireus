import { supabase } from './supabase-client.js';

async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('display-email').innerText = session.user.email;

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .maybeSingle();

    if (profile) {
        document.getElementById('display-username').innerText = profile.username || "No name";
        if (profile.avatar_url) document.getElementById('display-avatar').src = profile.avatar_url;
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

loadProfile();
supabase.auth.onAuthStateChange((event, session) => {
    if (!session) window.location.href = 'login.html';
});