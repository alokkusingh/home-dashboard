export function getHeadersJson() {
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