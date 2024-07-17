import {getHeadersJson} from './APIUtils'

export async function refreshSheet(sheet) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/etl/gsheet/refresh/' + sheet, requestOptions);
    const body = await responsePromise.json();
    console.log(body);
}