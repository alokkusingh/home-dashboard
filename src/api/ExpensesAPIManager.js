import {getHeadersJson} from './APIUtils'

export async function fetchCurrentMonthExpenseByDayJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/current_month_by_day', requestOptions);
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseByCategoryMonthJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/sum_by_category_month', requestOptions);
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseHeadsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/categories/names', requestOptions);
    const heads = await responsePromise.json();
    console.log(heads);

    return heads;
}

