const IDLE_THRESHOLD = 60 * 1000; // 60 seconds
let lastActivityTime = Date.now();
let heartbeatInterval: any = null;

function updateActivity() {
    lastActivityTime = Date.now();
}

const events = ['mousemove', 'keydown', 'scroll', 'click'];
events.forEach(event => {
    window.addEventListener(event, updateActivity, { passive: true });
});

function startHeartbeat() {
    if (heartbeatInterval) return;

    heartbeatInterval = setInterval(() => {
        const now = Date.now();
        if (now - lastActivityTime < IDLE_THRESHOLD) {
            try {
                chrome.runtime.sendMessage({
                    type: 'HEARTBEAT',
                    domain: window.location.hostname
                });
            } catch (e) {
                // Extension context invalidated (e.g. updated/reloaded)
                stopHeartbeat();
            }
        }
    }, 1000);
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    events.forEach(event => {
        window.removeEventListener(event, updateActivity);
    });
}

// Start tracking immediately
startHeartbeat();

// Handle visibility change (page hidden/shown)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Optionally pause heartbeat/reduce frequency when hidden
        // But for now we keep it simple, activity on a hidden tab (e.g. audio playing?)
        // Actually, user events won't fire on hidden tabs usually.
        // We rely on lastActivityTime.
    } else {
        updateActivity();
    }
});
