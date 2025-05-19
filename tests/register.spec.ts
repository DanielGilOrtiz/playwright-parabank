import { test } from "@playwright/test";
import { IndexPage } from "../pages/index-page";
import { RegisterPage } from "../pages/register-page";
import { OverviewPage } from "../pages/overview-page";
import { initializeDatabase } from "../helpers/db-helper";
import { USERS } from "../constants/users";

const validUser = USERS.validUser;
const accountCreatedMessage: string = "Your account was created successfully. You are now logged in.";
const existingUserErrorMessage: string = "This username already exists.";
const nonMatchingPasswordErrorMessage: string = "Passwords did not match.";

test.describe("Register", () => {
    let indexPage: IndexPage;
    let registerPage: RegisterPage;
    let overviewPage: OverviewPage;

    test.beforeEach(async ( {request, page} ) => {
        indexPage = new IndexPage(page);
        registerPage = new RegisterPage(page);
        overviewPage = new OverviewPage(page);
        
        await initializeDatabase({ request });
        await indexPage.land();
    }),

    [
        { optionalField: "all fields", phone: validUser.phone },
        { optionalField: "only mandatory fields", phone: "" },
    ].forEach(({ optionalField, phone }) => {
        test(`should create a new user with ${optionalField}`, async () => {
            await indexPage.goToRegisterPage();
            await registerPage.registerNewUserWith(
                validUser.username,
                validUser.password,
                validUser.password,
                validUser.firstName,
                validUser.lastName,
                validUser.address,
                validUser.city,
                validUser.state,
                validUser.zipCode,
                phone,
                validUser.ssn
            );
            await registerPage.assertUserIsLoggedIn(validUser.firstName, validUser.lastName);
            await overviewPage.assertUserIsRegstered(validUser.username, accountCreatedMessage);
        });
    });

    [
        { mandatoryField: "Username", username: "", password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "Password", username: validUser.username, password: "", confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "Password confirmation", username: validUser.username, password: validUser.password, confirmPassword: "", firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "First name", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: "", lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "Last name", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: "", address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "Address", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: "", city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "City", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: "", state: validUser.state, zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "State", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: "", zipCode: validUser.zipCode, ssn: validUser.ssn },
        { mandatoryField: "Zip Code", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: "", ssn: validUser.ssn },
        { mandatoryField: "Social Security Number", username: validUser.username, password: validUser.password, confirmPassword: validUser.password, firstName: validUser.firstName, lastName: validUser.lastName, address: validUser.address, city: validUser.city, state: validUser.state, zipCode: validUser.zipCode, ssn: "" }
    ].forEach(({ mandatoryField, username, password, confirmPassword, firstName, lastName, address, city, state, zipCode, ssn }) => {
        test(`should show error message with missing ${mandatoryField}`, async () => {
            await indexPage.goToRegisterPage();
            await registerPage.registerNewUserWith(
                username,
                password,
                confirmPassword,
                firstName,
                lastName,
                address,
                city,
                state,
                zipCode,
                "",
                ssn
            );
            await indexPage.assertUserIsNotLoggedIn();
            await registerPage.assertMissingFieldErrorMessage(mandatoryField);
        });
    });

    test("should show an error message when username is already taken", async () => {
        await indexPage.goToRegisterPage();
        await registerPage.registerNewUserWith(
            validUser.username,
            validUser.password,
            validUser.password,
            validUser.firstName,
            validUser.lastName,
            validUser.address,
            validUser.city,
            validUser.state,
            validUser.zipCode,
            validUser.phone,
            validUser.ssn
        );
        await overviewPage.assertUserIsRegstered(validUser.username, accountCreatedMessage);
        await overviewPage.logout();
        await indexPage.land();
        await indexPage.goToRegisterPage();
        await registerPage.registerNewUserWith(
            validUser.username,
            validUser.password,
            validUser.password,
            validUser.firstName,
            validUser.lastName,
            validUser.address,
            validUser.city,
            validUser.state,
            validUser.zipCode,
            validUser.phone,
            validUser.ssn
        );
        await registerPage.assertErrorMessage(existingUserErrorMessage);
    });

    test("should show an error message when confirm password doesn't match", async () => {
        await indexPage.goToRegisterPage();
        await registerPage.registerNewUserWith(
            validUser.username,
            validUser.password,
            "wrongPassword",
            validUser.firstName,
            validUser.lastName,
            validUser.address,
            validUser.city,
            validUser.state,
            validUser.zipCode,
            validUser.phone,
            validUser.ssn
        );
        await registerPage.assertErrorMessage(nonMatchingPasswordErrorMessage);
    });
});