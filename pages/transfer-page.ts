import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class TransferPage extends BasePage {
    private readonly Amount: Locator;
    private readonly FromAccountId: Locator;
    private readonly ToAccountId: Locator;
    private readonly Transfer: Locator;
    private readonly RightPanel: Locator;
    private readonly ErrorPanel: Locator;

    constructor (page: Page){
        super(page);
        this.Amount = page.getByTestId("amount");
        this.FromAccountId = page.getByTestId("fromAccountId");
        this.ToAccountId = page.getByTestId("toAccountId");
        this.Transfer = page.getByRole("button", {name: "Transfer"});
        this.RightPanel = page.locator("div[id='rightPanel']");
        this.ErrorPanel = page.getByTestId("showError");
    }

    async transferFunds(amount: string, fromAccountId: string, toAccountId: string) {
        await this.Amount.fill(amount);
        await this.FromAccountId.selectOption(fromAccountId);
        await this.ToAccountId.selectOption(toAccountId);
        await this.Transfer.click();
    }

    async assertTransferIsCompleted(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.RightPanel).toContainText("Transfer Complete!");
        await expect(this.RightPanel).toContainText(`$${amount} has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
        await expect(this.RightPanel).toContainText("See Account Activity for more details.");
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.ErrorPanel.locator("h1.title")).toHaveText("Error!");
        await expect(this.ErrorPanel.locator("p.error")).toHaveText(expectedErrorMessage);
    }
}