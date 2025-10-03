import {getHeadersNoAuthJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'

export async function fetchCurrentMonthExpenseByDayJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/current_month_by_day', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchCurrentMonthExpenseByDayJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseByCategoryMonthJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/sum_by_category_month', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpenseByCategoryMonthJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseByCategoryYearJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/sum_by_category_year', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpenseByCategoryYearJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseByCategoryForYearJson(year) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/sum_by_category_year?year=' + year, requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpenseByCategoryForYearJson(year);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchMonthlyExpensesForCategoryJson(category) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch("/home/api/expense/monthly/categories/" + category, requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchMonthlyExpensesForCategoryJson(category);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpensesJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesForYearMonthJson(yearMonth) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch("/home/api/expense?yearMonth=" + yearMonth, requestOptions)
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpensesForYearMonthJson(yearMonth);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpensesForYearMonthAndCategoryJson(yearMonth, category) {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch("/home/api/expense?yearMonth=" + yearMonth + "&category=" + category, requestOptions)
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpensesForYearMonthAndCategoryJson(yearMonth, category);
    }
    if (responsePromise.status === 403) {
      return;
    }
    const expenses = await responsePromise.json();
    console.log(expenses);

    return expenses;
}

export async function fetchExpenseHeadsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/categories/names', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpenseHeadsJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const heads = await responsePromise.json();
    console.log(heads);

    return heads;
}

export async function fetchExpenseMonthsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/expense/months', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchExpenseMonthsJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const months = await responsePromise.json();
    console.log(months);

    return months;
}


