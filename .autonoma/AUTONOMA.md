---
app_name: "Home Dashboard"
app_description: "A comprehensive personal finance and real estate management dashboard. It tracks expenses, salary, investments, and property project finances through automated email ingestion, manual forms, and bank statement uploads."
core_flows:
  - feature: "Finance - Summary"
    description: "Overview dashboard with tiles and charts for expenses, investments, estate holdings, and loans."
    mission: "Provide an accurate real-time snapshot of net worth and monthly cash flow through cross-category visualizations."
    core: true
    coreReason: "This is the primary entry point for users to understand their overall financial health."
  - feature: "Finance - Expense"
    description: "Detailed expense tracking with category and monthly filtering."
    mission: "Allow users to analyze spending habits through granular category-wise and month-on-month comparisons."
    core: false
  - feature: "Finance - Salary"
    description: "Tracks income, tax paid, and employer-specific compensation trends."
    mission: "Visualize long-term income growth and tax liabilities across different employers."
    core: false
  - feature: "Finance - Investment"
    description: "Monitors performance of various investment vehicles like PF, NPS, Mutual Funds, and Shares."
    mission: "Display historical performance and growth trends for each investment head against capital contributions."
    core: true
    coreReason: "Investment monitoring is critical for long-term financial planning and asset tracking."
  - feature: "Finance - Transaction"
    description: "Searchable list of all bank transactions across accounts."
    mission: "Enable users to find and verify individual financial events with detailed metadata."
    core: false
  - feature: "Finance - Upload File"
    description: "Processing interface for bank statement uploads."
    mission: "Correctly extract and ingest transaction data from uploaded statement files into the system."
    core: true
    coreReason: "If file upload fails, the system cannot ingest new bank data, making most reports stale."
  - feature: "Finance - Refresh"
    description: "Manual trigger to synchronize data with Google Sheets."
    mission: "Ensure local application data is up-to-date with external records stored in GSheets."
    core: false
  - feature: "Forms - Expense"
    description: "Manual expense entry and email-based transaction verification."
    mission: "Allow users to manually record expenses or verify and ingest unverified transactions caught from emails."
    core: true
    coreReason: "This is the primary way users maintain data accuracy by approving or manually adding missing expenses."
  - feature: "Forms - Estate"
    description: "Form for recording transfers between estate-related accounts."
    mission: "Accurately record capital movement between internal savings and specific real estate projects."
    core: false
  - feature: "Estate - Summary"
    description: "Consolidated view of all real estate project balances and loans."
    mission: "Show aggregate financial status across all property investments and associated liabilities."
    core: false
  - feature: "Estate - Odion"
    description: "Specific tracking for the Odion real estate project."
    mission: "Monitor project-specific cash flow and investment status for Odion."
    core: false
  - feature: "Estate - Adarsh Tropics"
    description: "Specific tracking for the Adarsh Tropica real estate project."
    mission: "Monitor project-specific cash flow and investment status for Adarsh Tropica."
    core: false
  - feature: "Estate - Jyothi"
    description: "Specific tracking for the Jyothi real estate project."
    mission: "Monitor project-specific cash flow and investment status for Jyothi."
    core: false
  - feature: "Estate - Transactions"
    description: "Audit trail of all property-related financial movements."
    mission: "Provide a chronological log of all capital deployments and expenses across real estate projects."
    core: false
  - feature: "Health - Alok"
    description: "Health tracking dashboard for Alok (TBD)."
    mission: "Monitor health metrics for Alok."
    core: false
  - feature: "Health - Rachna"
    description: "Health tracking dashboard for Rachna (TBD)."
    mission: "Monitor health metrics for Rachna."
    core: false
  - feature: "Health - Saanvi"
    description: "Health tracking dashboard for Saanvi (TBD)."
    mission: "Monitor health metrics for Saanvi."
    core: false
  - feature: "Data - Timeline"
    description: "Historical timeline of data events (TBD)."
    mission: "Provide a chronological overview of financial and data-related events."
    core: false
  - feature: "Data - Document"
    description: "Storage or log of financial documents (TBD)."
    mission: "Maintain access to supporting financial documentation."
    core: false
feature_count: 19
pages:
  - page: "/"
    description: "Main layout page containing the sidebar navigation and content area."
  - page: "src/HomeCards.js"
    description: "Summary dashboard with tiles and charts."
  - page: "src/ExpenseList.js"
    description: "Granular expense analysis and filtering."
  - page: "src/Salary.js"
    description: "Income and tax tracking."
  - page: "src/Investment.js"
    description: "Portfolio performance monitoring."
  - page: "src/TransactionList.js"
    description: "Historical transaction logs."
  - page: "src/UploadFile.js"
    description: "Bank statement ingestion tool."
  - page: "src/RefreshGoogleSheets.js"
    description: "GSheets data synchronization."
  - page: "src/FormExpense.js"
    description: "Manual entry and email verification for expenses."
  - page: "src/FormEstate.js"
    description: "Estate fund transfer entry."
  - page: "src/EstateSummary.js"
    description: "Consolidated estate portfolio view."
  - page: "src/Odion.js"
    description: "Odion project details."
  - page: "src/AdarshTropica.js"
    description: "Adarsh Tropica project details."
  - page: "src/Jyothi.js"
    description: "Jyothi project details."
  - page: "src/EstateTransactionList.js"
    description: "Chronological estate transactions."
---

# Home Dashboard

Home Dashboard is a personal financial hub designed to centralize the management of expenses, income, investments, and real estate projects. It combines automated data ingestion with manual entry to provide a holistic view of financial health.

## User Roles
- **Authorized User**: Authenticates via Google Login. Has full access to view reports, upload statements, and submit forms.
- **Administrator**: Managed via backend authorization (controlled by "Alok"), allows access to the dashboard features.

## Entry Point
- **Login Page**: A Google Sign-In gate that requires an authorized email address to proceed.
- **Landing Page**: The "Summary" view of the dashboard, showing high-level financial tiles.

## Navigation Structure
The application uses a vertical sidebar (tabular menu) divided into major sections:
- **Finance**: Summary, Expense, Salary, Investment, Transaction, Upload File, Refresh.
- **Forms**: Expense, Estate.
- **Estate**: Summary, Odion, Adarsh Tropics, Jyothi, Transactions, Land, Construction, Loan.
- **Health**: Alok, Rachna, Saanvi (individual health tracking).
- **Data**: Timeline, Document.

## Core Flows

### Financial Overview & Summary
The dashboard aggregates data from all modules to show current account balances, monthly trends, and investment returns. Users can click on summary charts or table rows to open modals with detailed transaction breakdowns.

### Expense Ingestion (Forms & Emails)
The `FormExpense` component is the nerve center for data accuracy. It displays "Unverified Transactions" parsed from emails. Users can "Accept" these to convert them into recorded expenses or "Reject" them. Manual expenses can also be keyed in using the same form.

### Investment Performance
The `Investment` view tracks multiple categories (NPS, PF, etc.). It uses line charts to show 5-year trends of contribution vs. market value. Clicking an investment head provides a monthly breakdown of returns (RoR).

### Bank Statement Upload
The `Upload File` feature allows users to drag-and-drop bank statements. The backend extracts transactions which are then indexed for search in the `Transaction` view.

## UI Patterns
- **Modals**: Extensively used for "Drill-down" views (e.g., clicking a summary row to see specific transactions).
- **Charts**: Built with Highcharts/Chart.js for visualizing trends (Bar, Pie, Line charts).
- **Idempotency**: All form submissions include an idempotency key to prevent accidental duplicate entries on network retry.
- **Search**: The Transaction view includes a real-time filter for transaction descriptions.

## Preferences
- **Currency**: Indian Rupee (INR) is the primary currency.
- **Date Format**: Standard date formatting used across lists and charts.
- **Storage**: Authentication profile and session tokens are stored in `localStorage` and `sessionStorage`.
