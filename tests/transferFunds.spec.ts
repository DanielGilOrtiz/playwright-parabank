import { test } from "../fixtures/openAccount.fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { BillPaymentPage } from "../pages/billPay-page";
import { FindTransactionsPage } from "../pages/findTransactions-page";
import { TransferPage } from "../pages/transfer-page";
import { initializeDatabase } from "../helpers/db-helper";

const defaultTransferAmount: string = "100.00";
const expectedErrorMessage: string = "An internal error has occurred and has been logged.";

test.describe("Funds transfer", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let billPaymentPage: BillPaymentPage;
    let findTransactionsPage: FindTransactionsPage;
    let transferPage: TransferPage;
    let defaultAccountId: string;
    let defaultAccountAvailableAmount: number;
    let newAccountId: string;
    let newAccountAvailableAmount: number;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser, openNewAccount }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        billPaymentPage = new BillPaymentPage(page);
        findTransactionsPage = new FindTransactionsPage(page);
        transferPage = new TransferPage(page);

        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        const defaultAccount = await loginAsRegisteredUser();
        defaultAccountId = defaultAccount.accountId;
        const newAccount = await openNewAccount();
        newAccountId = newAccount.accountId;
        newAccountAvailableAmount = newAccount.availableAmount;
        defaultAccountAvailableAmount = newAccount.defaultAccountAvailableAmount;
    });

    test("should be satisfactory when using valid data", async () => {
        await overviewPage.goToTransferFundsPage();
        await transferPage.transferFunds(defaultTransferAmount, defaultAccountId, newAccountId);
        await transferPage.assertTransferIsCompleted(defaultTransferAmount, defaultAccountId, newAccountId);
    });

    test("should update the accounts available amount", async () => {
        await overviewPage.goToTransferFundsPage();
        await transferPage.transferFunds(defaultTransferAmount, defaultAccountId, newAccountId);
        await transferPage.goToOverviewPage();
        await overviewPage.assertTransferUpdatedBalances(
            defaultAccountId,
            defaultAccountAvailableAmount,
            newAccountId,
            newAccountAvailableAmount,
            parseFloat(defaultTransferAmount)
        )
    });

    [
        { nonValidAmount: "emtpy", amountValue: "" },
        { nonValidAmount: "not a number", amountValue: "nonValidAmount" },
    ].forEach(({ nonValidAmount, amountValue }) => {
        test(`should return an error when using ${nonValidAmount} amount`, async () => {
            await overviewPage.goToTransferFundsPage();
            await transferPage.transferFunds(amountValue, defaultAccountId, newAccountId);
            await transferPage.assertErrorMessage(expectedErrorMessage);
        });
    });
})