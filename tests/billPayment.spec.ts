import { test } from "../fixtures/login.fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { BillPaymentPage } from "../pages/billPay-page";
import { FindTransactionsPage } from "../pages/findTransactions-page";
import { ActivityPage } from "../pages/activity-page";
import { initializeDatabase } from "../helpers/db-helper";
import { BILL_PAYMENT } from "../constants/billPayment";

const billPayment = BILL_PAYMENT.billPayment;
const nonValidAccountExpectedErrorMessage = "Please enter a valid number.";
const nonValidAmountExpectedErrorMessage = "Please enter a valid amount.";

test.describe("Bill payment transaction", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let billPaymentPage: BillPaymentPage;
    let findTransactionsPage: FindTransactionsPage;
    let activityPage: ActivityPage;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        billPaymentPage = new BillPaymentPage(page);
        findTransactionsPage = new FindTransactionsPage(page);
        activityPage = new ActivityPage(page);
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        await loginAsRegisteredUser();
    });

    test("should be satisfactory with valid data", async () => {
        const accountsIds: string[] = await overviewPage.getAccountsIds();
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
            "100.00",
            accountsIds[0]
        );
        await billPaymentPage.assertBillPaymentSucceeded(billPayment.name, "100.00", accountsIds[0]);
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
        test(`should show error message with missing ${missingField}`, async () => {
            const accountsIds: string[] = await overviewPage.getAccountsIds();
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
                accountsIds[0]
            );
            await billPaymentPage.assertMissingFieldErrorMessage(missingField);
        });
    });

    [
        { nonValidField: "Account", account: "non-valid-account", verifyAccount: billPayment.verifyAccount },
        { nonValidField: "Verify account", account: billPayment.account, verifyAccount: "non-valid-account" }
    ].forEach(({ nonValidField, account, verifyAccount }) => {
        test(`should show error message with non-valid ${nonValidField}`, async () => {
            const accountsIds: string[] = await overviewPage.getAccountsIds();
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
                "100",
                accountsIds[0]
            );
            await billPaymentPage.assertErrorMessage(nonValidAccountExpectedErrorMessage);
        });
    });

    test("should show error message with non-valid Amount", async () => {
        const accountsIds: string[] = await overviewPage.getAccountsIds();
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
            "non-valid-amount",
            accountsIds[0]
        );
        await billPaymentPage.assertErrorMessage(nonValidAmountExpectedErrorMessage);
    });

    test("should be found when filtering by Amount", async () => {
        const accountsIds: string[] = await overviewPage.getAccountsIds();
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
            "100.00",
            accountsIds[0]
        );
        await overviewPage.goToFindTransactionsPage();
        await findTransactionsPage.findTransactionBy("Amount", "100.00");
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });

    test("should be found when filtering by Date", async () => {
        const accountsIds: string[] = await overviewPage.getAccountsIds();
        const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
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
            "100.00",
            accountsIds[0]
        );
        await overviewPage.goToFindTransactionsPage();
        await findTransactionsPage.findTransactionBy("Date", currentDate);
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });

    test("should be found when filtering by Id", async () => {
        const accountsIds: string[] = await overviewPage.getAccountsIds();
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
            "100.00",
            accountsIds[0]
        );
        await overviewPage.goToOverviewPage();
        await overviewPage.openAccountDetails(accountsIds[0]);
        await activityPage.openTransactionDetails(billPayment.name);
        const transactionId = await activityPage.getTransactionId() ?? "";
        await overviewPage.goToFindTransactionsPage();
        await findTransactionsPage.findTransactionBy("Id", transactionId);
        await findTransactionsPage.assertTransactionIsAvailable(billPayment.name);
    });
});