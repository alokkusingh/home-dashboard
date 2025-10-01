import {getHeadersNoAuthJson, postHeadersNoAuthJson, fetch_retry_async_json} from './APIUtils'
import {redirectToLogin} from '../utils/SessionUtils'

export async function fetchUnverifiedTransactionEmailsJson() {
    let requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/email/transactions?verified=false', requestOptions);

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

export async function updateEmailTransactionAccepted(id) {

    //await submitExpenseForm(head, amount, comment);

    let requestOptions = {
      method: 'PUT',
      headers: postHeadersNoAuthJson(),
      body: JSON.stringify({
        'verified': true,
        'accepted': true
      })
    };
    const responsePromise = await fetch_retry_async_json(
      '/home/email/transactions/' + id,
      requestOptions,
      3
    );
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }

    return;
}

export async function updateEmailTransactionRejected(id) {
    let requestOptions = {
      method: 'PUT',
      headers: postHeadersNoAuthJson(),
      body: JSON.stringify({
        'verified': true,
        'accepted': false
      })
    };
    const responsePromise = await fetch_retry_async_json(
      '/home/email/transactions/' + id,
      requestOptions,
      3
    );
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }

    return;
}