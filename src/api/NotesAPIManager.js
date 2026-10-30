import {getHeadersNoAuthJson} from "./APIUtils";
import {refreshToken} from "../utils/SessionUtils";

const BASE_URL = '/home/docs/notes'; // Update to your spring boot server address

export async function fetchFileTreeJson() {
    // const response = await fetch(`${BASE_URL}/tree`);
    // if (!response.ok) throw new Error('Network error fetching note tree structure');
    // return response.json();

    let requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch(`${BASE_URL}/tree`, requestOptions);

    if (responsePromise.status === 401) {
        refreshToken();
        return fetchFileTreeJson();
    }
    if (responsePromise.status === 403) {
        return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchNoteContentText(relativePath) {
    // const response = await fetch(`${BASE_URL}/content?path=${encodeURIComponent(relativePath)}`);
    // if (!response.ok) throw new Error('Network error fetching markdown file content');
    // return response.text();

    const response = await fetch(`${BASE_URL}/content?path=${encodeURIComponent(relativePath)}`, {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    });
    if (!response.ok) throw new Error('Network error fetching markdown file content');
    return response.text();


    // let requestOptions = {
    //     method: 'GET',
    //     headers: getHeadersNoAuthJson()
    // };
    // const responsePromise = await fetch(`${BASE_URL}/content?path=${encodeURIComponent(relativePath)}`, requestOptions);
    //
    // if (responsePromise.status === 401) {
    //     refreshToken();
    //     return fetchNoteContentText(relativePath);
    // }
    // if (responsePromise.status === 403) {
    //     return;
    // }
    // const body = await responsePromise.json();
    // console.log(body);
    //
    // return body;
}