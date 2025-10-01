import {getHeadersNoAuthJson, fetch_retry_async_json} from './APIUtils'

export async function refreshSheet(sheet) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };

    const responsePromise = await fetch_retry_async_json(
      '/home/etl/gsheet/refresh/' + sheet,
      requestOptions,
      3
    );
    const body = await responsePromise.json();
    console.log(body);
}