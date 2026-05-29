/**
 * AndroidHandler - Standardized Bridge for Native Communication
 */
const AndroidHandler = {
    /**
     * Call this when a correct answer is given or a level is won.
     */
    sendSuccess: function() {
        if (window.AndroidBridge && typeof window.AndroidBridge.onGameSuccess === 'function') {
            window.AndroidBridge.onGameSuccess();
        } else {
            console.log("%c [AndroidBridge] Logic: Success Action Triggered ", "background: #2ecc71; color: #fff; padding: 2px 5px;");
        }
    },

    /**
     * Call this when a wrong answer is given or a life is lost.
     */
    sendWrong: function() {
        if (window.AndroidBridge && typeof window.AndroidBridge.onGameWrong === 'function') {
            window.AndroidBridge.onGameWrong();
        } else {
            console.log("%c [AndroidBridge] Logic: Wrong Action Triggered ", "background: #e74c3c; color: #fff; padding: 2px 5px;");
        }
    }
};

// Attach to window for global access
window.AndroidHandler = AndroidHandler;
