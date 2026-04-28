import { supabase } from './supabase-client.js';

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const switchAuth = document.getElementById('switch-auth');
const usernameInput = document.getElementById('username');
const toggleText = document.getElementById('auth-toggle-text');

let isLogin = true;

switchAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    authTitle.innerText = isLogin ? 'Login' : 'Sign Up';
    usernameInput.style.display = isLogin ? 'none' : 'block';
    usernameInput.required = !isLogin;
    toggleText.innerHTML = isLogin 
        ? 'Don\'t have an account? <span id="switch-auth">Sign Up</span>' 
        : 'Already have an account? <span id="switch-auth">Login</span>';
    document.getElementById('switch-auth').addEventListener('click', () => switchAuth.click());
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = usernameInput.value;

    if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
        } else {
            window.location.href = 'index.html';
        }
    } else {
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if (existingUser) {
            alert("Aquest nom d'usuari ja està en ús. Tria'n un altre.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: username }
            }
        });

        if (error) {
            alert(error.message);
        } else if (data.user) {
            if (data.user.identities && data.user.identities.length === 0) {
                alert("Aquest correu ja està registrat. Prova de fer login.");
                return;
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: data.user.id, username: username }]);
            
            if (profileError) {
                console.error("Error creating profile:", profileError);
            }

            if (data.session) {
                window.location.href = 'index.html';
            } else {
                alert('Check your email for the confirmation link!');
            }
        }
    }
});

supabase.auth.onAuthStateChange((event, session) => {
    if (session) window.location.href = 'index.html';
});