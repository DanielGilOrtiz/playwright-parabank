import { OverviewPage } from '../pages/overview-page';
import { OpenAccountPage } from '../pages/openAccount-page';
import { test as loginTest } from './login.fixtures';

type OpenAccountFixtures = {
  openNewAccount: () => Promise<string>;
};

// Extend from login fixtures since we need to be logged in to open an account
export const test = loginTest.extend<OpenAccountFixtures>({
  openNewAccount: async ({ page }, use) => {
    const overviewPage = new OverviewPage(page);
    const openAccountPage = new OpenAccountPage(page);
    
    const openNewAccount = async () => {
      const availableAccountsIds = await overviewPage.getAccountsIds();
      await overviewPage.goToOpenAccountPage();
      await openAccountPage.createAccount("CHECKING", availableAccountsIds[0]);
      await openAccountPage.assertNewAccountIsCreated();
      const newAccountId = await openAccountPage.getNewAccountId();
      await openAccountPage.goToOverviewPage();
      await overviewPage.assertAccountIsAvailable(newAccountId);
      return newAccountId;
    }; 
    await use(openNewAccount);
  }
});