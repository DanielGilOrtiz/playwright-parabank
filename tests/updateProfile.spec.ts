import { test } from "../fixtures/login.fixtures";
import { IndexPage } from "../pages/index-page";
import { RegisterPage } from "../pages/register-page";
import { OverviewPage } from "../pages/overview-page";
import { UpdateProfilePage } from "../pages/updateProfile-page";
import { initializeDatabase } from "../helpers/db-helper";

test.describe("Update Profile", () => {
    let indexPage: IndexPage;
    let registerPage: RegisterPage;
    let overviewPage: OverviewPage;
    let updateProfilePage: UpdateProfilePage;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser }) => {
        indexPage = new IndexPage(page);
        registerPage = new RegisterPage(page);
        overviewPage = new OverviewPage(page);
        updateProfilePage = new UpdateProfilePage(page);
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        await loginAsRegisteredUser();
    });

    [
        { fieldName: "First Name" },
        { fieldName: "Last Name" },
        { fieldName: "Address" },
        { fieldName: "City" },
        { fieldName: "State" },
        { fieldName: "Zip Code" },
        { fieldName: "Phone" }
    ].forEach(({ fieldName }) => {
        test(`should update data from field ${fieldName}`, async () => {
            await overviewPage.goToUpdateProfilePage();
            await updateProfilePage.updateExistingUserField(fieldName, "Updated field");
            await overviewPage.goToUpdateProfilePage();
            await updateProfilePage.assertFieldIsUpdated(fieldName, "Updated field");
        });
    });
});