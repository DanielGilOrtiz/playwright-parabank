import { OverviewPage } from '../pages/overview-page';
import { OpenAccountPage } from '../pages/open-account-page';
import { ActivityPage } from '../pages/activity-page';
import { test as loginTest } from './login-fixtures';

type OpenAccountFixtures = {
  openNewAccount: () => Promise<{
    accountId: string;
    availableAmount: number;
    defaultAccountAvailableAmount: number;
  }>;
};

// Extend from login fixtures since we need to be logged in to open an account
export const test = loginTest.extend<OpenAccountFixtures>({
  openNewAccount: async ({ page }, use) => {
    const overviewPage = new OverviewPage(page);
    const openAccountPage = new OpenAccountPage(page);
    const activityPage = new ActivityPage(page);
    
    const openNewAccount = async () => {
      const availableAccountsIds = await overviewPage.getAccountsIds();
      const defaultAccountId = availableAccountsIds[0];
      const accountsAvailableAmount = await overviewPage.getAccountsAvailableAmount();
      const defaultAccountAvailableAmount = accountsAvailableAmount[0];

      await overviewPage.goToOpenAccountPage();
      await openAccountPage.createAccount("CHECKING", defaultAccountId);
      await openAccountPage.assertNewAccountIsCreated();
      await openAccountPage.openNewAccountDetails();
      const newAccountId = await activityPage.getAccountId();
      if (!newAccountId) throw new Error('Failed to get new account ID');
      const newAccountBalance = await activityPage.getAccountAvailableAmount();

      return {
        accountId: newAccountId,
        availableAmount: newAccountBalance,
        defaultAccountAvailableAmount: defaultAccountAvailableAmount - 100 // Decrease by 100 since that amount is transferred to the new account
      };
    }; 
    await use(openNewAccount);
  }
});