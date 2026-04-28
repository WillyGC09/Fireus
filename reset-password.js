import { supabase } from './supabase-client.js';

const resetForm = document.getElementById('reset-form');
const resetMessage = document.getElementById('reset-message');

function showMessage(text, isError = true) {
    resetMessage.textContent = text;
    resetMessage.className = `feedback-message ${isError ? 'feedback-error' : 'feedback-success'}`;
    resetMessage.style.display = 'block';
}

async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
}

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    resetMessage.style.display = 'none';

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        showMessage("Error updating password: " + error.message);
    } else {
        showMessage("Password updated successfully! Redirecting...", false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});

supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") window.location.href = 'login.html';
});

checkSession();