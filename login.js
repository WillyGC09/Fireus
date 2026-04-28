import { supabase } from './supabase-client.js';

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const switchAuth = document.getElementById('switch-auth');
const usernameInput = document.getElementById('username');
const toggleText = document.getElementById('auth-toggle-text');
const authMessage = document.getElementById('auth-message');
const forgotPasswordBtn = document.getElementById('forgot-password');

let isLogin = true;

function showMessage(text, isError = true) {
    authMessage.textContent = text;
    authMessage.className = `feedback-message ${isError ? 'feedback-error' : 'feedback-success'}`;
    authMessage.style.display = 'block';
    if (!isError) {
        setTimeout(() => { authMessage.style.display = 'none'; }, 5000);
    }
}

switchAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    authMessage.style.display = 'none';
    authTitle.innerText = isLogin ? 'Login' : 'Sign Up';
    usernameInput.style.display = isLogin ? 'none' : 'block';
    usernameInput.required = !isLogin;
    toggleText.innerHTML = isLogin 
        ? 'Don\'t have an account? <span id="switch-auth">Sign Up</span>' 
        : 'Already have an account? <span id="switch-auth">Login</span>';
    document.getElementById('switch-auth').addEventListener('click', () => switchAuth.click());
});

forgotPasswordBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) {
        showMessage("Please enter your email address first.");
        return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://willygc09.github.io/Fireus/reset-password.html',
    });

    if (error) {
        showMessage("Error: " + error.message);
    } else {
        showMessage("Password reset email sent! Check your inbox.", false);
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.style.display = 'none';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = usernameInput.value.trim();

    if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showMessage(error.message);
        } else {
            window.location.href = 'index.html';
        }
    } else {
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .ilike('username', username)
            .maybeSingle();

        if (existingUser) {
            showMessage("This username is already in use. Please choose another.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: username },
                emailRedirectTo: 'https://willygc09.github.io/Fireus/index.html'
            }
        });

        if (error) {
            if (error.message.includes("rate limit exceeded")) {
                showMessage("Too many registration attempts. Please wait a few minutes.");
            } else if (error.message.includes("profiles_username_lower_unique_idx")) {
                showMessage("This username is already in use.");
            } else {
                showMessage(error.message);
            }
        } else if (data.user) {
            if (data.user.identities && data.user.identities.length === 0) {
                showMessage("Email already registered. Try to login.");
                return;
            }

            if (data.session) {
                window.location.href = 'index.html';
            } else {
                showMessage('Registration successful! Check your email for the confirmation link.', false);
            }
        }
    }
});

supabase.auth.onAuthStateChange((event, session) => {
    if (session) window.location.href = 'index.html';
});