import {postHeadersJson, fetch_retry, fetch_retry_async} from './APIUtils'

export async function submitExpenseForm(head, amount, comment) {
    var requestOptions = {
      method: 'POST',
      headers: postHeadersJson(),
      body: JSON.stringify({
        'head': head,
        'amount': amount,
        'comment': comment
      })
    };
    const responsePromise = await fetch_retry_async(
      '/home/etl/form/expense',
      requestOptions,
      3
    );
    const body = await responsePromise.json();
    console.log(body);
}

export async function submitEstateForm(particular, debitFrom, creditTo, amount) {
    var requestOptions = {
      method: 'POST',
      headers: postHeadersJson(),
      body: JSON.stringify({
        'particular': particular,
        'debitFrom': debitFrom,
        'creditTo': creditTo,
        'amount': amount
      })
    };
    const responsePromise = await fetch_retry_async(
      '/home/etl/form/estate',
      requestOptions,
      3
    );
    const body = await responsePromise.json();
    console.log(body);
}