import {getHeadersJson} from './APIUtils'

export async function fetchCurrentMonthExpenseByDayJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/current_month_by_day', requestOptions);
    if (responsePromise.status === 403) {
       console.error("API call failed - authn/authz failed!")
       return;
    }
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
    if (responsePromise.status === 403) {
       console.error("API call failed - authn/authz failed!")
       return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseByCategoryYearJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/sum_by_category_year', requestOptions);
    if (responsePromise.status === 403) {
       console.error("API call failed - authn/authz failed!")
       return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchMonthlyExpensesForCategoryJson(category) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch("/home/api/expense/monthly/categories/" + category, requestOptions);
    if (responsePromise.status === 403) {
       console.error("API call failed - authn/authz failed!")
       return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense', requestOptions);
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesForYearMonthJson(yearMonth) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch("/home/api/expense?yearMonth=" + yearMonth, requestOptions)
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesForYearMonthAndCategoryJson(yearMonth, category) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch("/home/api/expense?yearMonth=" + yearMonth + "&category=" + category, requestOptions)
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
    if (responsePromise.status === 403) {
       console.error("API call failed - authn/authz failed!")
       return;
    }
    const heads = await responsePromise.json();
    console.log(heads);

    return heads;
}

export async function fetchExpenseMonthsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/expense/months', requestOptions);
    const months = await responsePromise.json();
    console.log(months);

    return months;
}


