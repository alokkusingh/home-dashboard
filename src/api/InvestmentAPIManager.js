import Pbf from 'pbf'
import getInvestmentsResponse from '../proto/getInvestmentsResponse'
import getInvestmentsRorMetricsResponse from '../proto/getInvestmentsRorMetricsResponse'
import getRawInvestmentsResponse from '../proto/getRawInvestmentsResponse'

export async function fetchInvestmentReturnsProto() {
    var requestOptions = {
      method: 'GET',
      headers: getHeadersProto()
    };
    const responsePromise = await fetch('/home/api/investment/return', requestOptions);
    const responseBuffer = await responsePromise.arrayBuffer();
    var investmentsReturn = getInvestmentsRorMetricsResponse.GetInvestmentsRorMetricsResponse.read(new Pbf(responseBuffer));
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
    const investments = await responsePromise.josn();
    console.log(investments);

    return investments;
}

function getHeadersProto() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/x-protobuf");

    return myHeaders;
}

function getHeadersJson() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));
    myHeaders.append("Accept", "application/json");

    return myHeaders;
}