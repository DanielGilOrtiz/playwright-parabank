import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class FindTransactionsPage extends BasePage {
    private readonly FindByIdField: Locator;
    private readonly FindByIdButton: Locator;
    private readonly FindByDateField: Locator;
    private readonly FindByDateButton: Locator;
    private readonly FindByAmountField: Locator;
    private readonly FindByAmountButton: Locator;
    private readonly TransactionsTable: Locator;

    constructor (page: Page){
        super(page);
        this.FindByIdField = page.getByTestId("transactionId");
        this.FindByIdButton = page.getByTestId("findById");
        this.FindByDateField = page.getByTestId("transactionDate");
        this.FindByDateButton = page.getByTestId("findByDate");
        this.FindByAmountField = page.getByTestId("amount");
        this.FindByAmountButton = page.getByTestId("findByAmount"); 
        this.TransactionsTable = page.getByTestId("transactionTable");
    }

    async findTransactionBy(criteria: string, value: string) {
        switch (criteria) {
            case "Id":
                await this.FindByIdField.fill(value);
                await this.FindByIdButton.click();
                break;
            case "Date":
                await this.FindByDateField.fill(value);
                await this.FindByDateButton.click();
                break;
            case "Amount":
                await this.FindByAmountField.fill(value);
                await this.FindByAmountButton.click();
                break;
            default:
                throw new Error("Invalid criteria");
        }
    }

    async assertTransactionIsAvailable(payeeName: string) {
        const transactionCell: Locator = this.TransactionsTable.locator(`tr td:has-text("Bill Payment to ${payeeName}")`);
        await expect(transactionCell).toBeVisible();
    }
}