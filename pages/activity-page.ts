import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class ActivityPage extends BasePage {
    private readonly Go: Locator;
    private readonly AccountTable: Locator;

    constructor (page: Page){
        super(page);
        this.Go = page.locator("input[type='submit']");
        this.AccountTable = page.getByTestId("transactionTable");
    }

    async seeAccountActivity(){
        await this.Go.click();
        await expect(this.AccountTable).toBeVisible();
    }

    async openTransactionDetails(payeeName: string){
        const transactionCell: Locator = this.AccountTable.locator(`tr td:has-text("Bill Payment to ${payeeName}")`);
        await transactionCell.click();
    }

    async getTransactionId(){
        return this.page.locator('td:has-text("Transaction ID") + td').textContent();
    }
}