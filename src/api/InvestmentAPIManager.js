import Pbf from 'pbf'
import getInvestmentsResponse from '../proto/getInvestmentsResponse'
import getInvestmentsRorMetricsResponse from '../proto/getInvestmentsRorMetricsResponse'
import getRawInvestmentsResponse from '../proto/getRawInvestmentsResponse'
import {getHeadersJson, getHeadersProto} from './APIUtils'
import {redirectToLogin} from '../utils/SessionUtils'

export async function fetchInvestmentReturnsProto() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersProto()
    };
    const responsePromise = await fetch('/home/api/investment/return', requestOptions);
    if (responsePromise.status === 403) {
      redirectToLogin();
    }
    const responseBuffer = await responsePromise.arrayBuffer();
    var investmentsReturn = getInvestmentsRorMetricsResponse.GetInvestmentsRorMetricsResponse.read(new Pbf(responseBuffer));
    console.log(investmentsReturn);
    const investmentReturnList = investmentsReturn.investmentsRorMetrics;

    return investmentReturnList;
}

export async function fetchInvestmentReturnsJson() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/investment/return', requestOptions);
    if (responsePromise.status === 403) {
      redirectToLogin();
    }
    const investmentsReturn = await responsePromise.json();
    console.log(investmentsReturn);
    const investmentReturnList = investmentsReturn.investmentsRorMetrics;

    return investmentReturnList;
}

export async function fetchInvestmentSummaryProto() {

    var requestOptions = {
      method: 'GET',
      headers: getHeadersProto()
    };
    const responsePromise = await fetch('/home/api/investment/all', requestOptions);
    if (responsePromise.status === 403) {
      redirectToLogin();
    }
    const responseBuffer = await responsePromise.arrayBuffer();
    var investments = getInvestmentsResponse.GetInvestmentsResponse.read(new Pbf(responseBuffer));
    console.log(investments);

    return investments;
}

export async function fetchInvestmentsForHeadProto(head) {

    var requestOptions = {
      method: 'GET',
      headers: getHeadersProto()
    };
    const responsePromise = await fetch('/home/api/investment/head/' + head, requestOptions);
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const responseBuffer = await responsePromise.arrayBuffer();
    var investments = getRawInvestmentsResponse.GetRawInvestmentsResponse.read(new Pbf(responseBuffer)).investments;
    console.log(investments);

    return investments;
}

export async function fetchInvestmentsForMonthProto(month) {

    var requestOptions = {
      method: 'GET',
      headers: getHeadersProto()
    };
    const responsePromise = await fetch('/home/api/investment/month/' + month, requestOptions);
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const responseBuffer = await responsePromise.arrayBuffer();
    var investments = getRawInvestmentsResponse.GetRawInvestmentsResponse.read(new Pbf(responseBuffer)).investments;
    console.log(investments);

    return investments;
}

export async function fetchInvestmentSummaryJson() {

    var requestOptions = {
      method: 'GET',
      headers: getHeadersJson()
    };
    const responsePromise = await fetch('/home/api/investment/all', requestOptions);
    if (responsePromise.status === 401) {
      redirectToLogin();
    }
    if (responsePromise.status === 403) {
      return;
    }
    const investments = await responsePromise.josn();
    console.log(investments);

    return investments;
}