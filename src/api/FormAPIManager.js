import {postHeadersJson} from './APIUtils'

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
    const responsePromise = await fetch(
      '/home/etl/form/expense',
      requestOptions
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
    const responsePromise = await fetch(
      '/home/etl/form/estate',
      requestOptions
    );
    const body = await responsePromise.json();
    console.log(body);
}