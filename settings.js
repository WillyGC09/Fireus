import { supabase } from './supabase-client.js';

const avatarPreview = document.getElementById('avatar-preview');
const avatarWrapper = document.getElementById('avatar-wrapper');
const avatarInput = document.getElementById('avatar-input');
const editUsernameInput = document.getElementById('edit-username');
const editPasswordInput = document.getElementById('edit-password');
const avatarMessage = document.getElementById('avatar-message');
const profileMessage = document.getElementById('profile-message');
const securityNoteMessage = document.getElementById('security-note-message');
const currentPasswordInput = document.getElementById('current-password');
const saveButton = document.getElementById('save-btn');

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit

let currentSession = null;
let currentProfile = null;

function showMessage(element, text, isError = true) {
    element.textContent = text;
    element.className = `feedback-message ${isError ? 'feedback-error' : 'feedback-success'}`;
    element.style.display = 'block';
    if (!isError) {
        setTimeout(() => { element.style.display = 'none'; }, 5000);
    }
}

async function loadUserSettings() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        window.location.href = 'login.html';
        return;
    }

    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    currentSession = session;

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .maybeSingle();

    if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        showMessage(profileMessage, 'Error loading profile data: ' + profileError.message);
        return;
    }

    currentProfile = profile;

    if (profile) {
        editUsernameInput.value = profile.username || '';
        if (profile.avatar_url) {
            avatarPreview.src = profile.avatar_url;
        } else {
            avatarPreview.src = 'fireus.png';
            console.log("No avatar URL found, using default.");
        }
    }
}

async function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    avatarMessage.style.display = 'none';

    if (file.size > MAX_FILE_SIZE) {
        showMessage(avatarMessage, 'The image is too large. Maximum size is 1MB.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    const userId = currentSession.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    try {
        if (currentProfile?.avatar_url) {
            try {
                const url = new URL(currentProfile.avatar_url);
                const parts = url.pathname.split('/public/avatars/');
                if (parts.length > 1) {
                    const oldPath = parts[1];
                    await supabase.storage.from('avatars').remove([oldPath]);
                }
            } catch (e) { console.warn("Could not delete old avatar:", e); }
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true 
            });

        if (uploadError) throw uploadError;
        console.log('Avatar uploaded successfully to:', uploadData.path);

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userId);

        if (updateProfileError) throw updateProfileError;

        showMessage(avatarMessage, 'Profile photo updated successfully!', false);
        await loadUserSettings();
    } catch (error) {
        console.error('Error updating avatar:', error.message);
        showMessage(avatarMessage, 'Error: ' + error.message);
        avatarPreview.src = currentProfile?.avatar_url || 'fireus.png';
    }
}

async function handleSaveChanges(event) {
    event.preventDefault();

    const newUsername = editUsernameInput.value.trim();
    const newPassword = editPasswordInput.value;
    const currentPassword = currentPasswordInput.value;

    profileMessage.style.display = 'none';
    securityNoteMessage.style.display = 'none';

    if (!currentPassword) {
        showMessage(profileMessage, 'You must enter your current password to save changes.');
        return;
    }
    try {
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: currentSession.user.email,
            password: currentPassword,
        });

        if (authError) {
            let errorMessage = 'Authentication error.';
            if (authError.message.includes('Invalid login credentials') || authError.message.includes('Invalid password')) {
                errorMessage = 'Incorrect current password.';
            }
            showMessage(profileMessage, errorMessage);
            console.error('Authentication error:', authError.message);
            return;
        }
    } catch (error) {
        console.error('Unexpected authentication error during re-authentication:', error.message);
        showMessage(profileMessage, 'An unexpected error occurred.');
        return;
    }

    let changesMade = false;

    if (newUsername && newUsername !== currentProfile.username) {
        try {
            const { error: updateUsernameError } = await supabase
                .from('profiles')
                .update({ username: newUsername })
                .eq('id', currentSession.user.id);

            if (updateUsernameError) throw updateUsernameError;
            changesMade = true;
        } catch (error) {
            console.error('Error updating username:', error.message);
            showMessage(profileMessage, 'Error updating username: ' + error.message);
            return;
        }
    }

    if (newPassword) {
        try {
            const { error: updatePasswordError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updatePasswordError) throw updatePasswordError;
            changesMade = true;
        } catch (error) {
            console.error('Error updating password:', error.message);
            showMessage(profileMessage, 'Error updating password: ' + error.message);
            return;
        }
    }

    if (changesMade) {
        editPasswordInput.value = '';
        currentPasswordInput.value = '';
        showMessage(profileMessage, 'Profile updated successfully!', false);
        await loadUserSettings();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserSettings();
});

avatarInput.addEventListener('change', handleAvatarChange);
avatarWrapper.addEventListener('click', () => avatarInput.click());
saveButton.addEventListener('click', handleSaveChanges);

supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
        window.location.href = 'login.html';
    }
});