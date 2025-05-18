import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class OverviewPage extends BasePage {
    private readonly RightPanel: Locator;
    private readonly AccountTable: Locator;

    constructor (page: Page){
        super(page);
        this.RightPanel = page.locator("div[id='rightPanel']");
        this.AccountTable = page.locator("table[id='accountTable']");
    }

    async getAccountsIds() {
        await this.page.waitForLoadState('networkidle');
        return (await this.AccountTable.locator("tbody tr td:first-child a").allInnerTexts()).map(id => id.trim());
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
        const accountRow: Locator = this.AccountTable.locator(`tr:has(td:has-text("${accountId}"))`);
        const availableAmountText: string = await accountRow.locator("td:nth-child(2)").innerText();
        const availableAmount: number = parseFloat(availableAmountText.replace(/[$,]/g, ''));
        expect(availableAmount).toBeGreaterThanOrEqual(100);
    }
}