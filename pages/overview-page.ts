import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class OverviewPage extends BasePage {
    private readonly RightPanel: Locator;
    private readonly AccountTable: Locator;

    constructor (page: Page){
        super(page);
        this.RightPanel = page.getByTestId("rightPanel");
        this.AccountTable = page.getByTestId("accountTable");
    }

    async getAccountsIds() {
        await this.page.waitForLoadState('networkidle');
        return (await this.AccountTable.locator("tbody tr td:first-child a").allInnerTexts()).map(id => id.trim());
    }

    async getAccountsAvailableAmount() {
        await this.page.waitForLoadState('networkidle');
        const balances = await this.AccountTable.locator("tbody tr td:nth-child(3)").allInnerTexts();
        return balances.map(balance => parseFloat(balance.replace(/[$,]/g, '')));
    }

    async openAccountDetails(accountId: string) {
        const accountLink: Locator = this.AccountTable.locator(`a:has-text("${accountId}")`);
        await accountLink.click();
    }

    async assertUserIsRegstered(username: string, expectedWelcomeMessage: string) {
        await expect(this.RightPanel).toContainText("Welcome " + username);
        await expect(this.RightPanel).toContainText(expectedWelcomeMessage);
    }

    async assertAccountTableIsVisible() {
        await expect(this.AccountTable).toBeVisible();
    }

    async assertAccountTableIsNotEmpty() {
        const accountRowsCount: number = await this.AccountTable.locator("tr").count() - 1;

        expect(accountRowsCount).toBeGreaterThan(0);
    }

    async assertAccountIsAvailable(accountId: string) {
        const accountRow: Locator = this.AccountTable.locator(`tr:has(td:has-text("${accountId}"))`);

        await expect(accountRow).toBeVisible();
    }

    async assertAccountHasMinimumAmount(accountId: string) {
        const minimumAmount: number = 100;
        const accountRow: Locator = this.AccountTable.locator(`tr:has(td:has-text("${accountId}"))`);
        const availableAmountText: string = await accountRow.locator("td:nth-child(2)").innerText();
        const availableAmount: number = parseFloat(availableAmountText.replace(/[$,]/g, ''));
        
        expect(availableAmount).toBeGreaterThanOrEqual(minimumAmount);
    }

    async assertTransferUpdatedBalances(
        account1Id: string, 
        account1AmountBeforeTransfer: number, 
        account2Id: string, 
        account2AmountBeforeTransfer: number, 
        amount: number
    ) {
        const account1Row: Locator = this.AccountTable.locator(`tr:has(td:has-text("${account1Id}"))`);
        const account2Row: Locator = this.AccountTable.locator(`tr:has(td:has-text("${account2Id}"))`);

        const account1AvailableAmountText: string = await account1Row.locator("td:nth-child(2)").innerText();
        const account2AvailableAmountText: string = await account2Row.locator("td:nth-child(2)").innerText();

        const account1AvailableAmount: number = parseFloat(account1AvailableAmountText.replace(/[$,]/g, ''));
        const account2AvailableAmount: number = parseFloat(account2AvailableAmountText.replace(/[$,]/g, ''));

        expect(account1AvailableAmount).toEqual(account1AmountBeforeTransfer - amount);
        expect(account2AvailableAmount).toEqual(account2AmountBeforeTransfer + amount);
    }
}