import {getHeadersNoAuthJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'

export async function fetchAccountBalancesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/odion/accounts', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchAccountBalancesJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTransactionsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/odion/monthly/transaction', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchTransactionsJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchATransactionJson(id) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch("/home/api/odion/transactions/" + id, requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchATransactionJson(id);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}