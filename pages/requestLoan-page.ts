import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class LoanPage extends BasePage {
    private readonly LoanAmount: Locator;
    private readonly DownPayment: Locator;
    private readonly FromAccount: Locator;
    private readonly ApplyNow: Locator;
    private readonly requestLoanResult: Locator;
    private readonly NewAccountId: Locator;
    private readonly ErrorPanel: Locator;

    constructor (page: Page){
        super(page);
        this.LoanAmount = page.getByTestId("amount");
        this.DownPayment = page.getByTestId("downPayment");
        this.FromAccount = page.getByTestId("fromAccountId");
        this.ApplyNow = page.getByRole("button", { name: "APPLY NOW" });
        this.requestLoanResult = page.getByTestId("requestLoanResult");
        this.NewAccountId = page.locator("a[id='newAccountId']");
        this.ErrorPanel = page.getByTestId("requestLoanError");
    }

    async applyForLoan(amount: string, downPayment: string, accountId: string) {
        await this.LoanAmount.fill(amount);
        await this.DownPayment.fill(downPayment);
        await this.FromAccount.selectOption(accountId);
        await this.ApplyNow.click();
    }

    async openNewAccountDetails() {
        await this.NewAccountId.click();
        await this.page.waitForLoadState('networkidle');
    }

    async assertLoanRequestIsApproved() {
        await expect(this.requestLoanResult).toBeVisible();
        await expect(this.requestLoanResult).toContainText("Status: Approved");
        await expect(this.requestLoanResult).toContainText("Congratulations, your loan has been approved.");
        await expect(this.requestLoanResult).toContainText(/Your new account number: \d+/);
    }

    async assertLoandRequestIsDenied() {
        await expect(this.requestLoanResult).toBeVisible();
        await expect(this.requestLoanResult).toContainText("Status: Denied");
        await expect(this.requestLoanResult).toContainText("You do not have sufficient funds for the given down payment.");
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.ErrorPanel.locator("h1.title")).toHaveText("Error!");
        await expect(this.ErrorPanel.locator("p.error")).toHaveText(expectedErrorMessage);
    }
}