import { test } from "../fixtures/register-fixtures";
import { IndexPage } from "../pages/index-page";
import { RegisterPage } from "../pages/register-page";
import { OverviewPage } from "../pages/overview-page";
import { initializeDatabase } from "../helpers/db-helper";
import { USERS } from "../constants/users";

const nonValidUser = USERS.nonValidUser;
const wrongCredentialsErrorMessage: string = "The username and password could not be verified.";
const missingCredentialsErrorMessage: string = "Please enter a username and password.";

test.describe("Authentication", () => {
    let indexPage: IndexPage;
    let registerPage: RegisterPage;
    let overviewPage: OverviewPage;

    test.beforeEach(async ({ request, page, registerNewUser, registeredUser }) => {
        indexPage = new IndexPage(page);
        registerPage = new RegisterPage(page);
        overviewPage = new OverviewPage(page);
        
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
    }),

    test.describe("Login", () => {
        test("should access when using valid credentials", async ({ registeredUser }) => {
            await indexPage.login(registeredUser.username, registeredUser.password);
            await registerPage.assertUserIsLoggedIn(registeredUser.firstName, registeredUser.lastName);
            await overviewPage.assertAccountTableIsVisible();
            await overviewPage.assertAccountTableIsNotEmpty();
        });

        [
            { credential: "username", username: nonValidUser.username, password: USERS.validUser.password },
            { credential: "password", username: USERS.validUser.username, password: nonValidUser.password },
            { credential: "credentials", username: nonValidUser.username, password: nonValidUser.password }
        ].forEach(({ credential, username, password }) => {
            test(`should return an error when using wrong ${credential}`, async () => {
                await indexPage.login(username, password);
                await indexPage.assertErrorMessage(wrongCredentialsErrorMessage);
                await indexPage.assertUserIsNotLoggedIn();
            });
        });

        [
            { credential: "username", username: "", password: USERS.validUser.password },
            { credential: "password", username: USERS.validUser.username, password: "" },
            { credential: "credentials", username: "", password: "" }
        ].forEach(({ credential, username, password }) => {
            test(`should return an error when ${credential} is missing`, async () => {
                await indexPage.login(username, password);
                await indexPage.assertErrorMessage(missingCredentialsErrorMessage);
                await indexPage.assertUserIsNotLoggedIn();
            });
        });
    });

    test.describe("Logout", () => {
        test("should close the session successfully", async ({ registeredUser }) => {
            await indexPage.login(registeredUser.username, registeredUser.password);            
            await overviewPage.logout();
            await indexPage.assertUserIsNotLoggedIn();
        });
    });
});