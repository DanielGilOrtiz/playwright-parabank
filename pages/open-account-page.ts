import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class OpenAccountPage extends BasePage {
    private readonly AccountType: Locator;
    private readonly FromAccountId: Locator;
    private readonly OpenNewAccount: Locator;
    private readonly RightPanel: Locator;
    private readonly NewAccountId: Locator;

    constructor (page: Page){
        super(page);
        this.AccountType = page.getByTestId("type");
        this.FromAccountId = page.getByTestId("fromAccountId");
        this.OpenNewAccount = page.getByRole("button", {name: "Open New Account"});
        this.RightPanel = page.getByTestId("rightPanel");
        this.NewAccountId = page.getByTestId("newAccountId");
    }

    async createAccount(type: string, fromAccountId: string) {
        await this.AccountType.selectOption(type);
        await this.FromAccountId.selectOption(fromAccountId);
        await this.OpenNewAccount.click();
    }

    async openNewAccountDetails() {
        await this.NewAccountId.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getNewAccountId() {
        await this.NewAccountId.waitFor({ state: 'visible' });
        return await this.NewAccountId.innerText();
    }

    async assertNewAccountIsCreated() {
        await expect(this.RightPanel).toContainText("Congratulations, your account is now open.");
        await expect(this.RightPanel).toContainText("Account Opened!");
        await expect(this.RightPanel).toContainText(/Your new account number: \d+/);
    }
}