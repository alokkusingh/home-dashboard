import {getHeadersNoAuthJson} from "./APIUtils";
import {refreshToken} from "../utils/SessionUtils";

const BASE_URL = '/home/docs/pdfs'; // Adjust context path to match your application configuration

export async function fetchDocsTreeJson() {
    // const response = await fetch(`${BASE_URL}/tree`);
    // if (!response.ok) throw new Error('Failed to fetch PDF tree');
    // return response.json();

    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch(`${BASE_URL}/tree`, requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchDocsTreeJson();
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchDocsStream(selectedPath) {
    // const response = await fetch(`${BASE_URL}/tree`);
    // if (!response.ok) throw new Error('Failed to fetch PDF tree');
    // return response.json();

    const streamUrl = selectedPath
        ? `http://localhost:8080/home/api/docs/pdfs/stream?path=${encodeURIComponent(selectedPath)}`
        : '';

    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch(streamUrl, requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchDocsStream(selectedPath);
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}
