import { test } from "../fixtures/login-fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { BillPaymentPage } from "../pages/bill-pay-page";
import { FindTransactionsPage } from "../pages/find-transactions-page";
import { ActivityPage } from "../pages/activity-page";
import { initializeDatabase } from "../helpers/db-helper";
import { BILL_PAYMENT } from "../constants/billPayment";

const billPayment = BILL_PAYMENT.billPayment;
const defaultBillAmount: string = "100.00";
const nonValidAccountExpectedErrorMessage: string = "Please enter a valid number.";

test.describe("Bill payment transaction", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let billPaymentPage: BillPaymentPage;
    let findTransactionsPage: FindTransactionsPage;
    let activityPage: ActivityPage;
    let defaultAccount: { accountId: string; availableAmount: number };

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        billPaymentPage = new BillPaymentPage(page);
        findTransactionsPage = new FindTransactionsPage(page);
        activityPage = new ActivityPage(page);
        
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        defaultAccount = await loginAsRegisteredUser();
    });

    test("should be satisfactory when valid data is used", async () => {
        await overviewPage.goToBillPayPage();
        await billPaymentPage.billPayment(
            billPayment.name,
            billPayment.address,
            billPayment.city,
            billPayment.state,
            billPayment.zipCode,
            billPayment.phone,
            billPayment.account,
            billPayment.verifyAccount,
            defaultBillAmount,
            defaultAccount.accountId
        );
        await billPaymentPage.assertBillPaymentSucceeded(billPayment.name, "100.00", defaultAccount.accountId);
    });

    [
        { missingField: "Payee name", name: "", address: billPayment.address, city: billPayment.city, state: billPayment.state, zipCode: billPayment.zipCode, phone: billPayment.phone, account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "Address", name: billPayment.name, address: "", city: billPayment.city, state: billPayment.state, zipCode: billPayment.zipCode, phone: billPayment.phone, account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "City", name: billPayment.name, address: billPayment.address, city: "", state: billPayment.state, zipCode: billPayment.zipCode, phone: billPayment.phone, account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "State", name: billPayment.name, address: billPayment.address, city: billPayment.city, state: "", zipCode: billPayment.zipCode, phone: billPayment.phone, account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "Zip Code", name: billPayment.name, address: billPayment.address, city: billPayment.city, state: billPayment.state, zipCode: "", phone: billPayment.phone, account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "Phone number", name: billPayment.name, address: billPayment.address, city: billPayment.city, state: billPayment.state, zipCode: billPayment.zipCode, phone: "", account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "100" },
        { missingField: "Account number", name: billPayment.name, address: billPayment.address, city: billPayment.city, state: billPayment.state, zipCode: billPayment.zipCode, phone: billPayment.phone, account: "", verifyAccount: "", amount: "100" }
    ].forEach(({ missingField, name, address, city, state, zipCode, phone, account, verifyAccount, amount }) => {
        test(`should return an error when ${missingField} is missing`, async () => {
            await overviewPage.goToBillPayPage();
            await billPaymentPage.billPayment(
                name,
                address,
                city,
                state,
                zipCode,
                phone,
                account,
                verifyAccount,
                amount,
                defaultAccount.accountId
            );
            await billPaymentPage.assertMissingFieldErrorMessage(missingField);
        });
    });

    [
        { nonValidField: "Account", account: "non-valid-account", verifyAccount: billPayment.verifyAccount, amount: defaultBillAmount },
        { nonValidField: "Verify account", account: billPayment.account, verifyAccount: "non-valid-account", amount: defaultBillAmount },
        { nonValidField: "Amount", account: billPayment.account, verifyAccount: billPayment.verifyAccount, amount: "non-valid-amount" },
    ].forEach(({ nonValidField, account, verifyAccount, amount }) => {
        test(`should return an error when ${nonValidField} is non-valid`, async () => {
            await overviewPage.goToBillPayPage();
            await billPaymentPage.billPayment(
                billPayment.name,
                billPayment.address,
                billPayment.city,
                billPayment.state,
                billPayment.zipCode,
                billPayment.phone,
                account,
                verifyAccount,
                amount,
                defaultAccount.accountId
            );
            await billPaymentPage.assertErrorMessage(nonValidAccountExpectedErrorMessage);
        });
    });

    test("should be found when filtering by Amount", async () => {
        await overviewPage.goToBillPayPage();
        await billPaymentPage.billPayment(
            billPayment.name,
            billPayment.address,
            billPayment.city,
            billPayment.state,
            billPayment.zipCode,
            billPayment.phone,
            billPayment.account,
            billPayment.verifyAccount,
            defaultBillAmount,
            defaultAccount.accountId
        );
        await overviewPage.goToFindTransactionsPage();
        await findTransactionsPage.findTransactionBy("Amount", "100.00");
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });

    test("should be found when filtering by Date", async () => {
        await overviewPage.goToBillPayPage();
        await billPaymentPage.billPayment(
            billPayment.name,
            billPayment.address,
            billPayment.city,
            billPayment.state,
            billPayment.zipCode,
            billPayment.phone,
            billPayment.account,
            billPayment.verifyAccount,
            defaultBillAmount,
            defaultAccount.accountId
        );
        await overviewPage.goToFindTransactionsPage();
        const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        await findTransactionsPage.findTransactionBy("Date", currentDate);
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });

    test.fail("should be found when filtering by Id", { 
        annotation: { 
            type: "issue", 
            description: "Error retrieved when filtering by Transaction ID" 
        },
    }, async () => {
        await overviewPage.goToBillPayPage();
        await billPaymentPage.billPayment(
            billPayment.name,
            billPayment.address,
            billPayment.city,
            billPayment.state,
            billPayment.zipCode,
            billPayment.phone,
            billPayment.account,
            billPayment.verifyAccount,
            defaultBillAmount,
            defaultAccount.accountId
        );
        await overviewPage.goToOverviewPage();
        await overviewPage.openAccountDetails(defaultAccount.accountId);
        await activityPage.openTransactionDetails(billPayment.name);
        const transactionId = await activityPage.getTransactionId() ?? "";
        await overviewPage.goToFindTransactionsPage();
        await findTransactionsPage.findTransactionBy("Id", transactionId);
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });
});