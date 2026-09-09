import {getHeadersNoAuthJson} from "./APIUtils";
import {refreshToken} from "../utils/SessionUtils";

/**
 * Fetches the complete medical timeline grid for a given family member entity.
 * URL Target: GET /api/medical/timeline/{entityId}
 */
export async function fetchMedicalTimelineJson(entityId) {
    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/medical/timeline/' + entityId, requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchMedicalTimelineJson(entityId);
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}
