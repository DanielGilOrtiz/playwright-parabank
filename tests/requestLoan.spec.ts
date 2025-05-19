import { test } from "../fixtures/login.fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { BillPaymentPage } from "../pages/billPay-page";
import { FindTransactionsPage } from "../pages/findTransactions-page";
import { ActivityPage } from "../pages/activity-page";
import { LoanPage } from "../pages/requestLoan-page";
import { initializeDatabase } from "../helpers/db-helper";

const expectedErrorMessage: string = "An internal error has occurred and has been logged.";

test.describe("Loan Request", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let billPaymentPage: BillPaymentPage;
    let findTransactionsPage: FindTransactionsPage;
    let activityPage: ActivityPage;
    let loanPage: LoanPage;
    let defaultAccount: { accountId: string; availableAmount: number };

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        billPaymentPage = new BillPaymentPage(page);
        findTransactionsPage = new FindTransactionsPage(page);
        activityPage = new ActivityPage(page);
        loanPage = new LoanPage(page);
        
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        defaultAccount = await loginAsRegisteredUser();
    });

    test("should be approved when funds are enough", async () => {
        const loanAmount = defaultAccount.availableAmount;
        const downPayment = defaultAccount.availableAmount;
        
        await overviewPage.goToRequestLoanPage();
        await loanPage.applyForLoan(
            loanAmount.toString(),
            downPayment.toString(),
            defaultAccount.accountId
        );
        await loanPage.assertLoanRequestIsApproved();
    });

    test ("should create a new account with the loan amount when is approved", async () => {
        const loanAmount = defaultAccount.availableAmount;
        const downPayment = defaultAccount.availableAmount;

        await overviewPage.goToRequestLoanPage();
        await loanPage.applyForLoan(
            loanAmount.toString(),
            downPayment.toString(),
            defaultAccount.accountId
        );
        await loanPage.openNewAccountDetails();
        await activityPage.assertAccountHasAvailableAmount(defaultAccount.accountId, loanAmount);
    });

    test("should be denied when funds are not enough", async () => {
        const loanAmount = defaultAccount.availableAmount;
        const downPayment = defaultAccount.availableAmount + 0.01;
        
        await overviewPage.goToRequestLoanPage();
        await loanPage.applyForLoan(
            loanAmount.toString(),
            downPayment.toString(),
            defaultAccount.accountId
        );
        await loanPage.assertLoandRequestIsDenied();
    });

    [
        { missingField: "Loan Amount", loanAmount: "", downPayment: 1 },
        { missingField: "Down Payment", loanAmount: 1, downPayment: "" }
    ].forEach(({ missingField, loanAmount, downPayment }) => {
        test(`should return an error when ${missingField} is missing`, async () => {
            await overviewPage.goToRequestLoanPage();
            await loanPage.applyForLoan(
                loanAmount.toString(),
                downPayment.toString(),
                defaultAccount.accountId
            );
            await loanPage.assertErrorMessage(expectedErrorMessage);
        });
    });

    [
        { nonValidField: "Loan Amount", loanAmount: "nonValidAmount", downPayment: 1 },
        { nonValidField: "Down Payment", loanAmount: 1, downPayment: "nonValidAmount" }
    ].forEach(({ nonValidField, loanAmount, downPayment }) => {
        test(`should return an error when ${nonValidField} is non-valid`, async () => {
            await overviewPage.goToRequestLoanPage();
            await loanPage.applyForLoan(
                loanAmount.toString(),
                downPayment.toString(),
                defaultAccount.accountId
            );
            await loanPage.assertErrorMessage(expectedErrorMessage);
        });
    });
});