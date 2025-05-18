import { expect, Locator, Page } from "@playwright/test";

export class UpdateProfilePage {
    private readonly FirstName: Locator;
    private readonly LastName: Locator;
    private readonly Address: Locator;
    private readonly City: Locator;
    private readonly State: Locator;
    private readonly ZipCode: Locator;
    private readonly Phone: Locator;
    private readonly UpdateProfile: Locator;

    constructor (public readonly page: Page){
        this.FirstName = page.locator("input[name='customer.firstName']");
        this.LastName = page.locator("input[name='customer.lastName']");
        this.Address = page.locator("input[name='customer.address.street']");
        this.City = page.locator("input[name='customer.address.city']");
        this.State = page.locator("input[name='customer.address.state']");
        this.ZipCode = page.locator("input[name='customer.address.zipCode']");
        this.Phone = page.locator("input[name='customer.phoneNumber']");
        this.UpdateProfile = page.getByRole("button", {name: "Update Profile"});
    }

    async updateExistingUserField( field: string, value: string ) {
        switch (field) {
            case "First Name":
                await this.FirstName.fill(value);
                break;
            case "Last Name":
                await this.LastName.fill(value);
                break;
            case "Address":
                await this.Address.fill(value);
                break;
            case "City":
                await this.City.fill(value);
                break;
            case "State":
                await this.State.fill(value);
                break;
            case "Zip Code":
                await this.ZipCode.fill(value);
                break;
            case "Phone":
                await this.Phone.fill(value);
                break;
        }
        await this.UpdateProfile.click();
    };

    async assertFieldIsUpdated( field: string, value: string ) {
        switch (field) {
            case "First Name":
                await expect(this.FirstName).toHaveValue(value);
                break;
            case "Last Name":
                await expect(this.LastName).toHaveValue(value);
                break;
            case "Address":
                await expect(this.Address).toHaveValue(value);
                break;
            case "City":
                await expect(this.City).toHaveValue(value);
                break;
            case "State":
                await expect(this.State).toHaveValue(value);
                break;
            case "Zip Code":
                await expect(this.ZipCode).toHaveValue(value);
                break;
            case "Phone":
                await expect(this.Phone).toHaveValue(value);
                break;
        }
    }
}