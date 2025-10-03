import {getHeadersNoAuthJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'

export async function fetchSalaryByCompanyJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/bank/salary/bycompany', requestOptions);

    if (responsePromise.status === 401) {
      refreshToken();
      return fetchSalaryByCompanyJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchAllTransactionsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/bank/transactions', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
      return fetchAllTransactionsJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTransactionByIdJson(id) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/bank/transactions/' + id, requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
      return fetchTransactionByIdJson(id);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}

export async function fetchTransactionsByStatementFileJson(statementFile) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/bank/transactions?statementFileName=' + statementFile, requestOptions);
    if (responsePromise.status === 401) {
      return refreshToken();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const body = await responsePromise.json();
    console.log(body);

    return body;
}