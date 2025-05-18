import { test } from "../fixtures/openAccount.fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { BillPaymentPage } from "../pages/billPay-page";
import { FindTransactionsPage } from "../pages/findTransactions-page";
import { TransferPage } from "../pages/transfer-page";
import { initializeDatabase } from "../helpers/db-helper";

test.describe("Transfer funds", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let billPaymentPage: BillPaymentPage;
    let findTransactionsPage: FindTransactionsPage;
    let transferPage: TransferPage;
    let defaultAccountId: string;
    let newAccountId: string;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser, openNewAccount }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
        billPaymentPage = new BillPaymentPage(page);
        findTransactionsPage = new FindTransactionsPage(page);
        transferPage = new TransferPage(page);
        await initializeDatabase({ request });
        await indexPage.land();
        await registerNewUser();
        defaultAccountId = await loginAsRegisteredUser();
        newAccountId = await openNewAccount();
    });

    test("should be satisfactory with valid data", async () => {
        const amount = "100.00";

        await overviewPage.goToTransferFundsPage();
        await transferPage.transferFunds(amount, defaultAccountId, newAccountId);
        await transferPage.assertTransferIsCompleted(amount, defaultAccountId, newAccountId);
    });

});