import { test } from "../fixtures/login-fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { OpenAccountPage } from "../pages/open-account-page";
import { UpdateProfilePage } from "../pages/update-profile-page";
import { initializeDatabase } from "../helpers/db-helper";

test.describe("Open account", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let updateProfilePage: UpdateProfilePage;
    let openAccountPage: OpenAccountPage;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        openAccountPage = new OpenAccountPage(page);
        updateProfilePage = new UpdateProfilePage(page);
        
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        await loginAsRegisteredUser();
    });

    [
        { accountType: "CHECKING" },
        { accountType: "SAVINGS" },
    ].forEach(({ accountType }) => {
        test(`should create a new ${accountType} account`, async () => {
            let availableAccountsIds: string[] = await overviewPage.getAccountsIds();
            await overviewPage.goToOpenAccountPage();
            await openAccountPage.createAccount(accountType, availableAccountsIds[0]);
            await openAccountPage.assertNewAccountIsCreated();
        });
    });

    test("should display the new account in Accounts Overview", async () => {
        let availableAccountsIds: string[] = await overviewPage.getAccountsIds();
        await overviewPage.goToOpenAccountPage();
        await openAccountPage.createAccount("CHECKING", availableAccountsIds[0]);
        let newAccountId: string = await openAccountPage.getNewAccountId();
        await openAccountPage.goToOverviewPage();
        await overviewPage.assertAccountIsAvailable(newAccountId);
    });

    test("should create the new account with the minimum required amount", async () => {
        let availableAccountsIds: string[] = await overviewPage.getAccountsIds();
        await overviewPage.goToOpenAccountPage();
        await openAccountPage.createAccount("CHECKING", availableAccountsIds[0]);
        let newAccountId: string = await openAccountPage.getNewAccountId();
        await openAccountPage.goToOverviewPage();
        await overviewPage.assertAccountHasMinimumAmount(newAccountId);
    });
});