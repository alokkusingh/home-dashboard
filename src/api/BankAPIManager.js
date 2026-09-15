// BankAPIManager.js
import { fetch_retry_async_json, getHeadersNoAuthJson } from './APIUtils';

/**
 * Helper to standardise GET requests through our central retry engine
 */
async function secureGet(url) {
    const requestOptions = {
        method: 'GET',
        headers: getHeadersNoAuthJson()
    };

    // Leverages the robust error handling, status parsing, and retries from APIUtils
    const response = await fetch_retry_async_json(url, requestOptions, 1);
    return await response.json();
}

export async function fetchSalaryByCompanyJson() {
    try {
        const body = await secureGet('/home/api/bank/salary/bycompany');
        console.log("Salary by company data:", body);
        return body;
    } catch (error) {
        console.error("Failed to fetch salary data:", error);
        throw error; // Let the calling UI handle the catch block smoothly
    }
}

export async function fetchAllTransactionsJson() {
    try {
        const body = await secureGet('/home/api/bank/transactions');
        console.log("All transactions data:", body);
        return body;
    } catch (error) {
        console.error("Failed to fetch all transactions:", error);
        throw error;
    }
}

export async function fetchTransactionByIdJson(id) {
    try {
        const body = await secureGet(`/home/api/bank/transactions/${id}`);
        console.log(`Transaction profile data (${id}):`, body);
        return body;
    } catch (error) {
        console.error(`Failed to fetch transaction with ID ${id}:`, error);
        throw error;
    }
}

export async function fetchTransactionsByStatementFileJson(statementFile) {
    try {
        const encodedFile = encodeURIComponent(statementFile);
        const body = await secureGet(`/home/api/bank/transactions?statementFileName=${encodedFile}`);
        console.log(`Transactions for file (${statementFile}):`, body);
        return body;
    } catch (error) {
        console.error(`Failed to fetch transactions for file ${statementFile}:`, error);
        throw error;
    }
}