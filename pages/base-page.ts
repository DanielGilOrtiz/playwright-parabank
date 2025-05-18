import { Locator, Page } from "@playwright/test";

export class BasePage {
    protected readonly OpenAccount: Locator;
    protected readonly AccountsOverview: Locator;
    protected readonly TransferFunds: Locator;
    protected readonly BillPay: Locator;
    protected readonly FindTransactions: Locator;
    protected readonly UpdateContactInfo: Locator;
    protected readonly RequestLoan: Locator;
    protected readonly LogOut: Locator;

    constructor(protected readonly page: Page) {
        this.OpenAccount = page.getByRole("link", { name: "Open New Account" });
        this.AccountsOverview = page.getByRole("link", { name: "Accounts Overview" });
        this.TransferFunds = page.getByRole("link", { name: "Transfer Funds" });
        this.BillPay = page.getByRole("link", { name: "Bill Pay" });
        this.FindTransactions = page.getByRole("link", { name: "Find Transactions" });
        this.UpdateContactInfo = page.getByRole("link", { name: "Update Contact Info" });
        this.RequestLoan = page.getByRole("link", { name: "Request Loan" });
        this.LogOut = page.getByRole("link", { name: "Log Out" });
    }

    async goToOpenAccountPage() {
        await this.OpenAccount.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToOverviewPage() {
        await this.AccountsOverview.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToTransferFundsPage() {
        await this.TransferFunds.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToBillPayPage() {
        await this.BillPay.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToFindTransactionsPage() {
        await this.FindTransactions.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToUpdateProfilePage() {
        await this.UpdateContactInfo.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToRequestLoanPage() {
        await this.RequestLoan.click();
        await this.page.waitForLoadState("networkidle");
    }

    async logout() {
        await this.LogOut.click();
        await this.page.waitForLoadState("networkidle");
    }
}