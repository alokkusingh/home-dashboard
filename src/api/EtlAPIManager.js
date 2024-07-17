import {getHeadersOctet} from './APIUtils'

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