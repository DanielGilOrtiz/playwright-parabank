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

    constructor (public readonly page: Page){
        this.RightPanel = page.getByTestId("rightPanel");
        this.LeftPanel = page.getByTestId("leftPanel");
        this.Username = page.getByTestId("customer.username");
        this.Password = page.getByTestId("customer.password");
        this.ConfirmPassword = page.getByTestId("repeatedPassword");
        this.FirstName = page.getByTestId("customer.firstName");
        this.LastName = page.getByTestId("customer.lastName");
        this.Address = page.getByTestId("customer.address.street");
        this.City = page.getByTestId("customer.address.city");
        this.State = page.getByTestId("customer.address.state");
        this.ZipCode = page.getByTestId("customer.address.zipCode");
        this.Phone = page.getByTestId("customer.phoneNumber");
        this.SSN = page.getByTestId("customer.ssn");
        this.Register = page.getByRole("button", {name: "Register"});
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

    async assertUserIsLoggedIn(firstName: string, lastName: string) {
        await expect(this.LeftPanel).toContainText("Welcome " + firstName + " " + lastName);
        await expect(this.Username).not.toBeVisible();
        await expect(this.Password).not.toBeVisible();
        await expect(this.Register).not.toBeVisible();
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.RightPanel).toContainText(expectedErrorMessage);
    }

    async assertMissingFieldErrorMessage(expectedField: string){
        await expect(this.RightPanel).toContainText(expectedField + " is required.");
    }
}