import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class BillPaymentPage extends BasePage {
    private readonly RightPanel: Locator;
    private readonly Name: Locator;
    private readonly Address: Locator;
    private readonly City: Locator;
    private readonly State: Locator;
    private readonly ZipCode: Locator;
    private readonly Phone: Locator;
    private readonly Account: Locator;
    private readonly VerifyAccount: Locator;
    private readonly Amount: Locator;
    private readonly FromAccount: Locator;
    private readonly SendPayment: Locator;

    constructor (page: Page){
        super(page);
        this.RightPanel = page.locator("div[id='rightPanel']");
        this.Name = page.locator("input[name='payee.name']");
        this.Address = page.locator("input[name='payee.address.street']");
        this.City = page.locator("input[name='payee.address.city']");
        this.State = page.locator("input[name='payee.address.state']");
        this.ZipCode = page.locator("input[name='payee.address.zipCode']");
        this.Phone = page.locator("input[name='payee.phoneNumber']");
        this.Account = page.locator("input[name='payee.accountNumber']");
        this.VerifyAccount = page.locator("input[name='verifyAccount']");
        this.Amount = page.locator("input[name='amount']");
        this.FromAccount = page.locator("select[name='fromAccountId']");
        this.SendPayment = page.getByRole("button", {name: "Send Payment"});
    }

    async billPayment(
        name: string,
        address: string,
        city: string,
        state: string,
        zipCode: string,
        phone: string,
        account: string,
        verifyAccount: string,
        amount: string,
        fromAccount: string,
    ) {
        await this.Name.fill(name);
        await this.Address.fill(address);
        await this.City.fill(city);
        await this.State.fill(state);
        await this.ZipCode.fill(zipCode);
        await this.Phone.fill(phone);
        await this.Account.fill(account);
        await this.VerifyAccount.fill(verifyAccount);
        await this.Amount.fill(amount);
        await this.FromAccount.selectOption(fromAccount);
        await this.SendPayment.click();
    }

    async assertBillPaymentSucceeded(name: string, amount: string, account: string) {
        await expect(this.RightPanel).toContainText("Bill Payment Complete");
        await expect(this.RightPanel).toContainText(`Bill Payment to ${name} in the amount of $${amount} from account ${account} was successful.`);
        await expect(this.RightPanel).toContainText("See Account Activity for more details.");
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.RightPanel).toContainText(expectedErrorMessage);
    }

    async assertMissingFieldErrorMessage(expectedField: string){
        await expect(this.RightPanel).toContainText(expectedField + " is required.");
    }
}