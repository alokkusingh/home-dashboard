---
model_count: 10
factory_count: 8
models:
  - name: Expense
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/service/FormService.java
    creation_function: FormService.submitExpenseForm
    side_effects:
      - Sends data to an external GForm URL via RestTemplate
      - Deducts 05:30 hours from date if created via Batch job (ETL)
    created_by: []
  - name: Investment
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/processor/DefaultInvestmentProcessor.java
    creation_function: DefaultInvestmentProcessor.process
    side_effects:
      - Splits one RawInvestment into multiple Investment records (PF, NPS, LIC, SHARE)
    created_by: []
  - name: OdionTransaction
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/service/FormService.java
    creation_function: FormService.submitEstateForm
    side_effects:
      - Sends data to an external GForm URL via RestTemplate
    created_by: []
  - name: ProcessedFile
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/reader/CSVReader.java
    creation_function: CSVReader.close
    created_by: []
  - name: RawInvestment
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/job/InvestmentBatchJob.java
    creation_function: InvestmentBatchJob.investmentItemsReader
    side_effects:
      - Converted to Investment records during processing
    created_by: []
  - name: RawTransaction
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/reader/PDFReader.java
    creation_function: PDFReader.doRead
    side_effects:
      - Converted to Transaction records during processing
    created_by: []
  - name: Tax
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/job/TaxBatchJob.java
    creation_function: TaxBatchJob.taxItemsReader
    created_by: []
  - name: TaxMonthly
    independently_created: false
    created_by: []
  - name: Transaction
    independently_created: true
    creation_file: ../home-etl-service/src/main/java/com/alok/home/batch/processor/BankAccountProcessor.java
    creation_function: BankAccountProcessor.process
    side_effects:
      - Sets bank and head based on description keywords (Salary, Family, etc)
    created_by: []
  - name: UserInfo
    independently_created: false
    created_by: []
---

# Entity Audit

Framework: unknown

## Roots (independently_created: true)

- **Expense** - FormService.submitExpenseForm
- **Investment** - DefaultInvestmentProcessor.process
- **OdionTransaction** - FormService.submitEstateForm
- **ProcessedFile** - CSVReader.close
- **RawInvestment** - InvestmentBatchJob.investmentItemsReader
- **RawTransaction** - PDFReader.doRead
- **Tax** - TaxBatchJob.taxItemsReader
- **Transaction** - BankAccountProcessor.process

## Dependents (independently_created: false)

- **TaxMonthly** - created by: unknown
- **UserInfo** - created by: unknown

## Dual-creation models (independently_created AND created_by)

None
