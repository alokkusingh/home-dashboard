import { redirectToLogin } from '../utils/SessionUtils';
import { getOrCreateIdempotencyKey } from '../utils/IdempotencyUtils';

export function getHeadersNoAuthJson() {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("issuer", "home-stack-auth");
    return myHeaders;
}

export function getEventStreamHeadersJson() {
    const myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "text/event-stream");
    return myHeaders;
}

export function postHeadersNoAuthJson(idempotencyKey) {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("issuer", "home-stack-auth");
    if (idempotencyKey) {
        myHeaders.append("Idempotency-Key", idempotencyKey);
    }
    return myHeaders;
}

export function uploadHeadersJson(idempotencyKey) {
    const myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "application/json");
    if (idempotencyKey) {
        myHeaders.append("Idempotency-Key", idempotencyKey);
    }
    return myHeaders;
}

export function getHeadersNoAuthProto() {
    const myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "application/x-protobuf");
    return myHeaders;
}

export function getHeadersOctet() {
    const myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "application/octet-stream");
    return myHeaders;
}

/**
 * Robust async fetch wrapper supporting retries and central error dispatching
 */
export async function fetch_retry_async_json(url, options, n) {
    try {
        const response = await fetch(url, options);

        // 1. Return immediately on successful standard payloads
        if (response.status === 200 || response.status === 201 || response.status === 202) {
            return response;
        }

        // 2. Handle unauthorized edge cases smoothly
        if (response.status === 401) {
            redirectToLogin();
            throw new Error("Session expired. Redirecting to login...");
        }

        if (response.status === 403) {
            throw new Error("API call failed - Forbidden access (403)!");
        }

        if (response.status === 400) {
            throw new Error("API call failed - Bad request (400)!");
        }

        // 3. Trigger retries on generic server down flags (5xx codes, etc.)
        if (n <= 0) {
            throw new Error("API call failed - Max retry threshold reached!");
        }

        console.warn(`Fetch failed with status ${response.status}. Retrying... (${n} left)`);
        await delay(1000);
        return await fetch_retry_async_json(url, options, n - 1);

    } catch (error) {
        // If it's already a clean error object we intentionally threw, pass it up
        throw error;
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));