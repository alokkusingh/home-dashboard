import {getHeadersJson} from './APIUtils'
import {redirectToLogin} from '../utils/SessionUtils'

export async function fetchYearlyTaxPaidJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/tax/all', requestOptions);
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}