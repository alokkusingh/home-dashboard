import {getHeadersJson} from './APIUtils'

export async function fetchMonthlyIncomeExpenseSummaryJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/summary/monthly?sinceMonth=2007-06', requestOptions);
    const summaryRecords = await responsePromise.json();
    console.log(summaryRecords);

    return summaryRecords;
}