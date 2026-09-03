---
scenario_count: 1
scenarios:
  - name: standard
    description: "Standard personal finance state with historical data across expenses, investments, and taxes."
entity_types:
  - name: UserInfo
    count: 1
  - name: Expense
    count: 15
  - name: Investment
    count: 10
  - name: RawInvestment
    count: 2
  - name: Transaction
    count: 10
  - name: RawTransaction
    count: 2
  - name: Tax
    count: 1
  - name: TaxMonthly
    count: 4
  - name: OdionTransaction
    count: 3
  - name: ProcessedFile
    count: 4
---

### UserInfo
| name | email |
|------|-------|
| Alok Singh | alok.ku.singh+{{testRunId}}@gmail.test |

### Expense
| id | date | head | amount | comment | category | monthx | yearx |
|----|------|------|--------|---------|----------|--------|-------|
| 1 | 2024-01-05 | Groceries | 2500.0 | Weekly refill | Needs | 1 | 2024 |
| 2 | 2024-01-10 | Amazon | 1200.0 | Electronics {{testRunShortId}} | Wants | 1 | 2024 |
| 3 | 2024-01-15 | Rent | 35000.0 | Jan House Rent | Needs | 1 | 2024 |
| 4 | 2024-01-20 | Zomato | 850.0 | Dinner | Wants | 1 | 2024 |
| 5 | 2024-01-25 | Fuel | 3000.0 | Petrol refill | Needs | 1 | 2024 |
| 6 | 2024-02-05 | Groceries | 2800.0 | Monthly supply | Needs | 2 | 2024 |
| 7 | 2024-02-12 | Netflix | 499.0 | Subscription | Wants | 2 | 2024 |
| 8 | 2024-02-15 | Rent | 35000.0 | Feb House Rent | Needs | 2 | 2024 |
| 9 | 2024-02-20 | Dining | 2200.0 | Birthday Party | Wants | 2 | 2024 |
| 10 | 2024-02-28 | Electricity | 1500.0 | Bill payment | Needs | 2 | 2024 |
| 11 | 2024-03-05 | Groceries | 2400.0 | Refill | Needs | 3 | 2024 |
| 12 | 2024-03-15 | Rent | 35000.0 | Mar House Rent | Needs | 3 | 2024 |
| 13 | 2024-03-20 | Gym | 2000.0 | Membership | Needs | 3 | 2024 |
| 14 | 2024-03-25 | BookMyShow | 1200.0 | Movie night | Wants | 3 | 2024 |
| 15 | 2024-03-30 | Internet | 1000.0 | Monthly wifi | Needs | 3 | 2024 |

### Investment
| id | yearx | monthx | head | contribution | valueAsOnMonth | contributionAsOnMonth |
|----|-------|--------|------|--------------|----------------|-----------------------|
| 1 | 2024 | 1 | PF | 15000 | 1200000 | 1100000 |
| 2 | 2024 | 1 | NPS | 10000 | 500000 | 450000 |
| 3 | 2024 | 1 | SHARE | 25000 | 850000 | 700000 |
| 4 | 2024 | 1 | LIC | 5000 | 200000 | 180000 |
| 5 | 2024 | 1 | MF | 20000 | 600000 | 500000 |
| 6 | 2024 | 2 | PF | 15000 | 1220000 | 1115000 |
| 7 | 2024 | 2 | NPS | 10000 | 515000 | 460000 |
| 8 | 2024 | 2 | SHARE | 30000 | 900000 | 730000 |
| 9 | 2024 | 2 | LIC | 5000 | 205000 | 185000 |
| 10 | 2024 | 2 | MF | 20000 | 630000 | 520000 |

### RawInvestment
| id | year | month | pfContribution | pfValueAsOnMonth | npsContribution | npsValueAsOnMonth | licContribution | licValueAsOnMonth | shareContribution | shareValueAsOnMonth | mfContribution | mfValueAsOnMonth |
|----|------|-------|----------------|------------------|-----------------|-------------------|-----------------|-------------------|-------------------|---------------------|----------------|------------------|
| 1 | 2024 | 1 | 15000 | 1200000 | 10000 | 500000 | 5000 | 200000 | 25000 | 850000 | 20000 | 600000 |
| 2 | 2024 | 2 | 15000 | 1220000 | 10000 | 515000 | 5000 | 205000 | 30000 | 900000 | 20000 | 630000 |

### Transaction
| id | date | debit | credit | head | subHead | description | isSalary | bank | file |
|----|------|-------|--------|------|---------|-------------|----------|------|------|
| 1 | 2024-01-01 | 0 | 150000 | Salary | Employer A | Monthly Salary {{testRunShortId}} | true | HDFC | jan_stmt.pdf |
| 2 | 2024-01-05 | 2500 | 0 | Expense | Groceries | BigBasket Store | false | HDFC | jan_stmt.pdf |
| 3 | 2024-01-15 | 35000 | 0 | Rent | Home | Landlord Transfer | false | HDFC | jan_stmt.pdf |
| 4 | 2024-01-20 | 10000 | 0 | Investment | SIP | MF Utility | false | HDFC | jan_stmt.pdf |
| 5 | 2024-01-28 | 5000 | 0 | Family | Parents | Monthly Transfer | false | HDFC | jan_stmt.pdf |
| 6 | 2024-02-01 | 0 | 150000 | Salary | Employer A | Monthly Salary | true | KOTAK | feb_stmt.pdf |
| 7 | 2024-02-05 | 3000 | 0 | Fuel | Petrol | Shell Station | false | KOTAK | feb_stmt.pdf |
| 8 | 2024-02-12 | 2000 | 0 | Dining | Restaurant | Pizza Hut | false | KOTAK | feb_stmt.pdf |
| 9 | 2024-02-15 | 35000 | 0 | Rent | Home | Landlord Transfer | false | KOTAK | feb_stmt.pdf |
| 10 | 2024-02-25 | 1000 | 0 | Misc | Cash | ATM Withdrawal | false | KOTAK | feb_stmt.pdf |

### RawTransaction
| lines | file |
|-------|------|
| ["2024-01-01,150000,Salary","2024-01-05,2500,Groceries"] | jan_stmt.pdf |
| ["2024-02-01,150000,Salary","2024-02-05,3000,Fuel"] | feb_stmt.pdf |

### Tax
| id | financialYear | paidAmount | refundAmount |
|----|---------------|------------|--------------|
| 1 | 2023-24 | 450000 | 12000 |

### TaxMonthly
| id | yearx | monthx | paidAmount |
|----|-------|--------|------------|
| 1 | 2023 | 11 | 35000 |
| 2 | 2023 | 12 | 35000 |
| 3 | 2024 | 1 | 38000 |
| 4 | 2024 | 2 | 38000 |

### OdionTransaction
| id | date | particular | debitAccount | creditAccount | amount |
|----|------|------------|--------------|---------------|--------|
| 1 | 2024-01-10 | Maintenance Fee | SAVING | ODION | 5000.0 |
| 2 | 2024-02-15 | Property Tax | SAVING | ODION | 12000.0 |
| 3 | 2024-03-20 | Interest Income | SBI_MAX_GAIN | SAVING | 4500.0 |

### ProcessedFile
| id | name | date | records | type |
|----|------|------|---------|------|
| 1 | kotak_jan_{{testRunShortId}}.csv | 2024-02-01 | 54 | KotakExportedStatement |
| 2 | hdfc_jan_{{testRunShortId}}.pdf | 2024-02-01 | 42 | HDFCExportedStatement |
| 3 | expenses_2024.xlsx | 2024-04-01 | 150 | ExpenseGoogleSheet |
| 4 | investments_v1.xlsx | 2024-04-01 | 12 | InvestmentGoogleSheet |
