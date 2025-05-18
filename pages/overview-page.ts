import { expect, Locator, Page } from "@playwright/test";

export class OverviewPage {
    private readonly RightPanel: Locator;
    private readonly AccountTable: Locator;
    private readonly UpdateProfile: Locator;

    constructor (public readonly page: Page){
        this.RightPanel = page.locator("div[id='rightPanel']");
        this.AccountTable = page.locator("table[id='accountTable']");
        this.UpdateProfile = page.locator("a[href='updateprofile.htm']");
    }

    async goToUpdateProfilePage() {
        await this.UpdateProfile.click();
        await this.page.waitForLoadState("networkidle");
    }

    async assertUserIsRegstered(username: string, expectedWelcomeMessage: string) {
        await expect(this.RightPanel).toContainText("Welcome " + username);
        await expect(this.RightPanel).toContainText(expectedWelcomeMessage);
    }

    async assertAccountTableIsVisible() {
        await expect(this.AccountTable).toBeVisible();
    }

    async assertAccountTableIsNotEmpty() {
        const accountRows = await this.AccountTable.locator("tr").count() - 1; // Subtract header row
        expect(accountRows).toBeGreaterThan(0);
    }
}