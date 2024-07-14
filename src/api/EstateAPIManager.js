import {getHeadersJson} from './APIUtils'

export async function fetchAccountBalancesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/odion/accounts', requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTransactionsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/odion/monthly/transaction', requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchATransactionJson(id) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch("/home/api/odion/transactions/" + id, requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}