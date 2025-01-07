import {redirectToLogin} from '../utils/SessionUtils'

export function getHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/json");

    return myHeaders;
}

export function postHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    return myHeaders;
}

export function uploadHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/json");

    return myHeaders;
}

export function getHeadersProto() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/x-protobuf");

    return myHeaders;
}

export function getHeadersOctet() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/octet-stream");

    return myHeaders;
}

export async function fetch_retry_async_json(url, options, n)  {
    const promise = await fetch(url, options);
    if (promise.status === 200 || promise.status === 201 || promise.status === 202) {
       return promise;
    }

    if (promise.status === 401) {
      redirectToLogin();
    }

    if (responsePromise.status === 403) {
      return;
    }

    if (promise.status === 400) {
       throw "API call failed - bad request!"
    }

    if (n === 0) {
      throw "API call failed - max retry reached!"
    }
    await delay(1000);
    return fetch_retry_async_json(url, options, n-1) ;

};

const delay = ms => new Promise(res => setTimeout(res, ms));