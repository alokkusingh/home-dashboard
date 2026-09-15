// SessionUtils.js

/**
 * Validates the session with the backend asynchronously.
 * @returns {Promise<boolean>}
 */
export async function aValidateSession() {
    console.log("validateSession invoked");
    try {
        const response = await fetch("/home/auth/home/token/validate", {
            method: "GET"
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Session validation network error:", error);
        return false;
    }
}

/**
 * Refreshes the session token asynchronously.
 * @returns {Promise<boolean>}
 */
export async function refreshToken() {
    console.log("refreshToken invoked");
    try {
        const response = await fetch("/home/auth/home/token/refresh", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "grant-type": "refresh_token"
            }
        });

        if (response.ok) {
            return true;
        } else if (response.status === 401) {
            console.error('Authentication required: 401 Unauthorized');
            return false; // Let the calling component handle state teardown cleanly
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error("Token refresh network error:", error);
        return false;
    }
}

/**
 * Logs out the backend session asynchronously.
 * @returns {Promise<boolean>}
 */
export async function logout() {
    console.log("logout invoked");
    try {
        const response = await fetch("/home/auth/home/token/logout", {
            method: "POST"
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Logout network error:", error);
        return false;
    }
}

/**
 * Safe fallback replacement for legacy external rendering redirects.
 * Clears local context states and forces a clean application fallback redirect.
 */
export function redirectToLogin() {
    console.warn("Legacy external redirect fallback invoked.");

    // Clear out local cache trace flags
    localStorage.removeItem("profile");
    sessionStorage.removeItem("LOGGED_IN");

    // Smoothly reset back to the root router authentication path
    window.location.href = "/";
}