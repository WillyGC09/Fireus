/**
 * Updates the Discord online user count on the webpage.
 * @param {string} elementId The ID of the HTML element to display the count.
 * @param {string} guildId The Discord guild ID for the widget.
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
        countEl.textContent = 'N/A'; // Indicate an error gracefully
    }
}

/**
 * Initializes the Discord online count update mechanism.
 * @param {string} elementId The ID of the HTML element to display the count.
 * @param {string} guildId The Discord guild ID for the widget.
 * @param {number} intervalMs The interval in milliseconds to refresh the count.
 */
export function initDiscordOnlineCounter(elementId, guildId, intervalMs = 10000) {
    updateDiscordOnlineCount(elementId, guildId);
    setInterval(() => updateDiscordOnlineCount(elementId, guildId), intervalMs);
}