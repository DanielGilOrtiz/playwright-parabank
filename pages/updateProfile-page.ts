import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class UpdateProfilePage extends BasePage {
    private readonly FirstName: Locator;
    private readonly LastName: Locator;
    private readonly Address: Locator;
    private readonly City: Locator;
    private readonly State: Locator;
    private readonly ZipCode: Locator;
    private readonly Phone: Locator;
    private readonly UpdateProfile: Locator;

    constructor (page: Page){
        super(page);
        this.FirstName = page.locator("input[name='customer.firstName']");
        this.LastName = page.locator("input[name='customer.lastName']");
        this.Address = page.locator("input[name='customer.address.street']");
        this.City = page.locator("input[name='customer.address.city']");
        this.State = page.locator("input[name='customer.address.state']");
        this.ZipCode = page.locator("input[name='customer.address.zipCode']");
        this.Phone = page.locator("input[name='customer.phoneNumber']");
        this.UpdateProfile = page.getByRole("button", {name: "Update Profile"});
    }

    async updateExistingUserField(field: string, value: string) {
        const fieldMap: Record<string, Locator> = {
            "First Name": this.FirstName,
            "Last Name": this.LastName,
            "Address": this.Address,
            "City": this.City,
            "State": this.State,
            "Zip Code": this.ZipCode,
            "Phone": this.Phone,
        };

        const locator = fieldMap[field];
        if (!locator) {
            throw new Error(`Field ${field} is not recognized`);
        }
        await locator.fill(value);
        await this.UpdateProfile.click();
    }

    async assertFieldIsUpdated(field: string, value: string) {
        const fieldMap: Record<string, Locator> = {
            "First Name": this.FirstName,
            "Last Name": this.LastName,
            "Address": this.Address,
            "City": this.City,
            "State": this.State,
            "Zip Code": this.ZipCode,
            "Phone": this.Phone,
        };

        const locator = fieldMap[field];
        if (!locator) {
            throw new Error(`Field ${field} is not recognized`);
        }
        await expect(locator).toHaveValue(value);
    }
}