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
        .select('username')
        .eq('id', session.user.id)
        .maybeSingle();

    let username = profile?.username;

    if (!username && session.user.user_metadata?.username) {
        username = session.user.user_metadata.username;
    }

    if (username) {
        document.getElementById('display-username').innerText = username;
    } else {
        document.getElementById('display-username').innerText = "Perfil no trobat";
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert(error.message);
    } else {
        window.location.href = 'index.html';
    }
});

loadProfile();
supabase.auth.onAuthStateChange((event, session) => {
    if (!session) window.location.href = 'login.html';
});