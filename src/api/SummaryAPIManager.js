import {getHeadersNoAuthJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'


export async function fetchMonthlyIncomeExpenseSummaryJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersNoAuthJson()
    };
    const responsePromise = await fetch('/home/api/summary/monthly?sinceMonth=2007-06', requestOptions);
    if (responsePromise.status === 401) {
      refreshToken();
            return fetchMonthlyIncomeExpenseSummaryJson();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const summaryRecords = await responsePromise.json();
    console.log(summaryRecords);

    return summaryRecords;
}