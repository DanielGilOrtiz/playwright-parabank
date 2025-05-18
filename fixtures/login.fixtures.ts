import { IndexPage } from '../pages/index-page';
import { RegisterPage } from '../pages/register-page';
import { OverviewPage } from '../pages/overview-page';
import { test as registerTest } from './register.fixtures';

type LoginFixtures = {
  loginAsRegisteredUser: () => Promise<string>;
};

// Extend from register fixtures to have access to registeredUser
export const test = registerTest.extend<LoginFixtures>({
  loginAsRegisteredUser: async ({ page, registeredUser }, use) => {
    const indexPage = new IndexPage(page);
    const registerPage = new RegisterPage(page);
    const overviewPage = new OverviewPage(page);
    
    const loginAsRegisteredUser = async () => {
      await indexPage.login(registeredUser.username, registeredUser.password);
      await registerPage.assertUserIsLoggedIn(registeredUser.firstName, registeredUser.lastName);
      await overviewPage.assertAccountTableIsVisible();
      await overviewPage.assertAccountTableIsNotEmpty();
      const accountsIds = await overviewPage.getAccountsIds();
      return accountsIds[0];
    };
    await use(loginAsRegisteredUser);
  }
});
