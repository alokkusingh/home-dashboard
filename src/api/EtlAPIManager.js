import {getHeadersOctet, getHeadersNoAuthJson} from './APIUtils'
import {redirectToLogin} from '../utils/SessionUtils'

export async function etlDownloadTransactions() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersOctet()
    };
    const responsePromise = await fetch('/home/etl/report/download', requestOptions);
    const blob = await responsePromise.blob();
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();

    return "downloaded";
}

export async function fetchProcessedFilesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/etl/file/processed', requestOptions);
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