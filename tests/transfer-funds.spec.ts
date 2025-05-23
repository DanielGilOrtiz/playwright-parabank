import { test } from "../fixtures/account-fixtures";
import { IndexPage } from "../pages/index-page";
import { OverviewPage } from "../pages/overview-page";
import { TransferPage } from "../pages/transfer-page";
import { initializeDatabase } from "../helpers/db-helper";

const defaultTransferAmount: string = "100.00";
const expectedErrorMessage: string = "An internal error has occurred and has been logged.";

test.describe("Funds transfer", () => {
    let indexPage: IndexPage;
    let overviewPage: OverviewPage;
    let transferPage: TransferPage;
    let defaultAccountId: string;
    let defaultAccountAvailableAmount: number;
    let newAccountId: string;
    let newAccountAvailableAmount: number;

    test.beforeEach(async ({ request, page, registerNewUser, loginAsRegisteredUser, openNewAccount }) => {
        indexPage = new IndexPage(page);
        overviewPage = new OverviewPage(page);
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