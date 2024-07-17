import {getHeadersJson} from './APIUtils'

export async function fetchSalaryByCompanyJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/bank/salary/bycompany', requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchAllTransactionsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/bank/transactions', requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTransactionByIdJson(id) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/bank/transactions/' + id, requestOptions);
    const body = await responsePromise.json();
    console.log(body);

    return body;
}