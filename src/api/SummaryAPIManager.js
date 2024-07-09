import {getHeadersJson} from './APIUtils'

export async function fetchMonthlyIncomeExpenseSummaryJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/summary/monthly', requestOptions);
    const summaryRecords = await responsePromise.json();
    console.log(summaryRecords);

    return summaryRecords;
}