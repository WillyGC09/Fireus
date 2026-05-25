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
    console.log('Auth state changed:', event, session ? 'has session' : 'no session');
    if (session) {
        console.log('Session detected, redirecting to index.html');
        window.location.href = 'index.html';
    }
});

// Check on page load if user just returned from OAuth
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log('User has session on page load');
        window.location.href = 'index.html';
    }
});

// Also check when visibility changes (user returns from OAuth tab)
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        console.log('Page became visible, checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log('Session found after visibility change');
            window.location.href = 'index.html';
        }
    }
});

// OAuth Handlers
async function handleOAuthLogin(provider) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: 'https://willygc09.github.io/Fireus/index.html',
            }
        });

        if (error) {
            showMessage(`Error signing in with ${provider}: ${error.message}`);
        }
    } catch (error) {
        showMessage(`An error occurred: ${error.message}`);
    }
}

// Check if user logged in via OAuth and validate Discord uniqueness
async function validateOAuthSession() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (!sessionError && session) {
        const user = session.user;
        
        // Check if user has Discord identity
        const discordIdentity = user.identities?.find(identity => identity.provider === 'discord');
        if (discordIdentity) {
            // Get Discord user ID from identity
            const discordUserId = discordIdentity.id;
            
            // Check if another user already has this Discord linked
            const { data: otherUsers, error: checkError } = await supabase
                .from('user_oauth_links')
                .select('user_id')
                .eq('provider', 'discord')
                .eq('provider_id', discordUserId)
                .neq('user_id', user.id)
                .maybeSingle();

            if (!checkError && otherUsers) {
                // Discord is already linked to another account
                await supabase.auth.signOut();
                showMessage('This Discord account is already linked to another Fireus Games account. Please use that account to log in.');
                return false;
            }

            // Store or update Discord link in database
            const { error: upsertError } = await supabase
                .from('user_oauth_links')
                .upsert({
                    user_id: user.id,
                    provider: 'discord',
                    provider_id: discordUserId,
                    provider_name: discordIdentity.identity_data?.user_name || 'Discord User'
                }, {
                    onConflict: 'user_id,provider'
                });

            if (upsertError) {
                console.error('Error storing Discord link:', upsertError);
            }
        }
    }
}

const discordLoginBtn = document.getElementById('discord-login');

discordLoginBtn.addEventListener('click', () => handleOAuthLogin('discord'));

// Validate OAuth session on page load
window.addEventListener('load', () => {
    validateOAuthSession();
});