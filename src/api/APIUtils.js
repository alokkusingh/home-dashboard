import {redirectToLogin} from '../utils/SessionUtils'

export function getHeadersNoAuthJson() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("issuer", "home-stack-auth");
    return myHeaders;
}

export function getEventStreamHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "text/event-stream");

    return myHeaders;
}

export function postHeadersNoAuthJson() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("issuer", "home-stack-auth");

    return myHeaders;
}

export function uploadHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "application/json");

    return myHeaders;
}

export function getHeadersNoAuthProto() {
    var myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
    myHeaders.append("Accept", "application/x-protobuf");

    return myHeaders;
}

export function getHeadersOctet() {
    var myHeaders = new Headers();
    myHeaders.append("issuer", "home-stack-auth");
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

    if (promise.status === 403) {
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