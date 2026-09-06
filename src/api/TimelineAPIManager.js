import {getHeadersNoAuthJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'

export async function fetchTimelineFamilyJson() {
    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/timeline/family', requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchTimelineFamilyJson();
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTimelineEventsJson() {
    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/timeline/events', requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchTimelineEventsJson();
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTimelineEventByIdJson(id) {
    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch(`/home/api/timeline/events/` + id, requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchTimelineEventByIdJson(id);
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}