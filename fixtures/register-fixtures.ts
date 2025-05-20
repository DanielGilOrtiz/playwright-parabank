import { test as base } from '@playwright/test';
import { IndexPage } from '../pages/index-page';
import { RegisterPage } from '../pages/register-page';
import { USERS } from '../constants/users';
import { OverviewPage } from '../pages/overview-page';

type RegisterFixtures = {
  registeredUser: typeof USERS.validUser;
  registerNewUser: () => Promise<void>;
};

export const test = base.extend<RegisterFixtures>({
  registeredUser: USERS.validUser,
  registerNewUser: async ({ page }, use) => {
    const registerNewUser = async () => {
      const indexPage = new IndexPage(page);
      const registerPage = new RegisterPage(page);
      const overviewPage = new OverviewPage(page);
      await indexPage.goToRegisterPage();
      await registerPage.registerNewUserWith(
        USERS.validUser.username,
        USERS.validUser.password,
        USERS.validUser.password,
        USERS.validUser.firstName,
        USERS.validUser.lastName,
        USERS.validUser.address,
        USERS.validUser.city,
        USERS.validUser.state,
        USERS.validUser.zipCode,
        USERS.validUser.phone,
        USERS.validUser.ssn
      );
      await overviewPage.logout();
      await indexPage.land();
    };
    await use(registerNewUser);
  }
});