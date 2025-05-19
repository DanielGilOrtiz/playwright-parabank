import { expect, Locator, Page } from "@playwright/test";

export class IndexPage {
    private readonly Username: Locator;
    private readonly Password: Locator;
    private readonly Login: Locator;
    private readonly RightPanel: Locator;
    private readonly Register: Locator;
    private readonly AccountsOverview: Locator;

    constructor (public readonly page: Page){
        this.Username = page.locator("input[name='username']");
        this.Password = page.locator("input[name='password']");
        this.Register = page.getByRole("link", {name: "Register"});
        this.AccountsOverview = page.getByRole("link", {name: "Accounts Overview"});
        this.Login = page.getByRole("button", {name: "Log In"});
        this.RightPanel = page.locator("div[id='rightPanel']");
    }

    async land() {
        await this.page.goto("/");
    }

    async goToRegisterPage() {
        await this.Register.click();
        await this.page.waitForLoadState("networkidle");
    }

    async login(username: string, password: string) {
        await this.Username.fill(username);
        await this.Password.fill(password);
        await this.Login.click();
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.RightPanel.locator("h1.title")).toHaveText("Error!");
        await expect(this.RightPanel.locator("p.error")).toHaveText(expectedErrorMessage);
    }

    async assertUserIsNotLoggedIn() {
        const title = this.RightPanel.locator("h1.title");
        
        if (await title.isVisible()) await expect(title).not.toContainText("Welcome");
        await expect(this.Username).toBeVisible();
        await expect(this.Password).toBeVisible();
        await expect(this.Login).toBeVisible();
    }
}