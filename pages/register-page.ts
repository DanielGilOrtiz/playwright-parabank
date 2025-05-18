import { expect, Locator, Page } from "@playwright/test";

export class RegisterPage {
    private readonly RightPanel: Locator;
    private readonly LeftPanel: Locator;
    private readonly Username: Locator;
    private readonly Password: Locator;
    private readonly ConfirmPassword: Locator;
    private readonly FirstName: Locator;
    private readonly LastName: Locator;
    private readonly Address: Locator;
    private readonly City: Locator;
    private readonly State: Locator;
    private readonly ZipCode: Locator;
    private readonly Phone: Locator;
    private readonly SSN: Locator;
    private readonly Register: Locator;
    private readonly Logout: Locator;

    constructor (public readonly page: Page){
        this.RightPanel = page.locator("div[id='rightPanel']");
        this.LeftPanel = page.locator("div[id='leftPanel']");
        this.Username = page.locator("input[name='customer.username']");
        this.Password = page.locator("input[name='customer.password']");
        this.ConfirmPassword = page.locator("input[name='repeatedPassword']");
        this.FirstName = page.locator("input[name='customer.firstName']");
        this.LastName = page.locator("input[name='customer.lastName']");
        this.Address = page.locator("input[name='customer.address.street']");
        this.City = page.locator("input[name='customer.address.city']");
        this.State = page.locator("input[name='customer.address.state']");
        this.ZipCode = page.locator("input[name='customer.address.zipCode']");
        this.Phone = page.locator("input[name='customer.phoneNumber']");
        this.SSN = page.locator("input[name='customer.ssn']");
        this.Register = page.getByRole("button", {name: "Register"});
        this.Logout = page.getByText("Log Out");
    }

    async registerNewUserWith(
        username: string, 
        password: string, 
        confirmPassword: string, 
        firstName: string, 
        lastName: string, 
        address: string, 
        city: string, 
        state: string, 
        zipCode: string, 
        phone: string, 
        ssn: string, 
    ) {
        await this.Username.fill(username);
        await this.Password.fill(password);
        await this.ConfirmPassword.fill(confirmPassword);
        await this.FirstName.fill(firstName);
        await this.LastName.fill(lastName);
        await this.Address.fill(address);
        await this.City.fill(city);
        await this.State.fill(state);
        await this.ZipCode.fill(zipCode);
        await this.Phone.fill(phone);
        await this.SSN.fill(ssn);
        await this.Register.click();
    }

    async logout() {
        await this.Logout.click();
    }

    async assertUserIsLoggedIn(firstName: string, lastName: string) {
        await expect(this.LeftPanel).toContainText("Welcome " + firstName + " " + lastName);
        await expect(this.Username).not.toBeVisible();
        await expect(this.Password).not.toBeVisible();
        await expect(this.Register).not.toBeVisible();
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.RightPanel).toContainText(expectedErrorMessage);
    }

    async assertMissingFieldErrorMessage(expectedErrorMessage: string){
        await expect(this.RightPanel).toContainText(expectedErrorMessage + " is required.");
    }
}