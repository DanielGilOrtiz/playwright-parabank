import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class ActivityPage extends BasePage {
    private readonly AccountTable: Locator;
    private readonly AccountId: Locator;
    private readonly AccountAvailableAmount: Locator;

    constructor (page: Page){
        super(page);
        this.AccountTable = page.getByTestId("transactionTable");
        this.AccountId = page.getByTestId("accountId");
        this.AccountAvailableAmount = page.getByTestId("availableBalance");
    }

    async openTransactionDetails(payeeName: string){
        const transactionCell: Locator = this.AccountTable.locator(`tr td:has-text("Bill Payment to ${payeeName}")`);
        await transactionCell.click();
    }

    async getTransactionId(){
        return this.page.locator('td:has-text("Transaction ID") + td').textContent();
    }

    async getAccountId(){
        await this.AccountId.waitFor({ state: 'visible' });
        return await this.AccountId.textContent();
    }

    async getAccountAvailableAmount(){
        await this.AccountAvailableAmount.waitFor({ state: 'visible' });
        const availableAmountText = await this.AccountAvailableAmount.textContent();
        return parseFloat(availableAmountText?.replace(/[$,]/g, '') ?? '0');
    }

    async assertAccountHasAvailableAmount(acountId: string, expectedAmount: number) {
        const newAccountAvailableAmount = await this.getAccountAvailableAmount();
        expect(newAccountAvailableAmount).toEqual(expectedAmount);
    }
}