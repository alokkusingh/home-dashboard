import {getHeadersJson} from './APIUtils'

export async function fetchYearlyTaxPaidJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/tax/all', requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}