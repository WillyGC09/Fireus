/**
 * @param {string} elementId
 * @param {string} guildId
 */
export async function updateDiscordOnlineCount(elementId, guildId) {
    const countEl = document.getElementById(elementId);
    if (!countEl) {
        console.warn(`Element with ID '${elementId}' not found for Discord online count.`);
        return;
    }

    try {
        const response = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
        const data = await response.json();

        const newCount = typeof data.presence_count === 'number' ? data.presence_count : 0;
        const oldCount = parseInt(countEl.textContent) || 0;

        if (newCount !== oldCount) {
            const duration = 500;
            const startTime = performance.now();
            function animate(time) {
                const elapsed = time - startTime;
                const t = Math.min(elapsed / duration, 1);
                const value = Math.floor(oldCount + (newCount - oldCount) * t);
                countEl.textContent = value;
                if (t < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }
    } catch (error) {
        console.error('Error fetching Discord online count:', error);
        countEl.textContent = 'N/A';
    }
}

/**
 * @param {string} elementId
 * @param {string} guildId
 * @param {number} intervalMs
 */
export function initDiscordOnlineCounter(elementId, guildId, intervalMs = 10000) {
    updateDiscordOnlineCount(elementId, guildId);
    setInterval(() => updateDiscordOnlineCount(elementId, guildId), intervalMs);
}