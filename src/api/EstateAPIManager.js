import {getHeadersNoAuthJson} from './APIUtils'
import {redirectToLogin} from '../utils/SessionUtils'

export async function fetchAccountBalancesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/odion/accounts', requestOptions);
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

export async function fetchTransactionsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/odion/monthly/transaction', requestOptions);
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

export async function fetchATransactionJson(id) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch("/home/api/odion/transactions/" + id, requestOptions);
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