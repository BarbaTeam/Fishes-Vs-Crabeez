import { expect } from '@playwright/test';
import { E2EComponentFixture } from '@e2e/e2e-component.fixture';

import { NavbarButtonFixture } from '@app/shared/components/navbar-button/navbar-button.fixture';
import { NewChildButtonFixture } from '@app/shared/components/new-child-button/new-child-button.fixture';
import { InnerBoxFixture } from '@app/shared/components/inner-box/inner-box.fixture';
import { StatefulUsersListFixture } from '@app/shared/components/stateful-user-list/stateful-users-list.fixture';



export class ChildsListPageFixture extends E2EComponentFixture{
    private navbarButton = new NavbarButtonFixture(this.page);
    private newChildButton = new NewChildButtonFixture(this.page);
    private innerBox = new InnerBoxFixture(this.page);
    private usersList = new StatefulUsersListFixture(this.page);

    async navigateToNewChild(): Promise<void> {
        await this.newChildButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectChild(name: string): Promise<void> {
        await this.usersList.selectUser(name);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyPageElements(): Promise<void> {
        await expect(this.navbarButton.playerList()).toBeVisible();
        await expect(this.navbarButton.gamesManager()).toBeVisible();
        await expect(this.navbarButton.home()).toBeVisible();
        await expect(this.page.locator('h3.title')).toHaveText(/Séléctionnez un enfant/i);
        await expect(this.innerBox.userBox()).toBeVisible();
        await expect(this.newChildButton.locator()).toBeVisible();
    }

    async verifyChildExists(name: string): Promise<void> {
        await this.usersList.verifyUserExists(name);
    }

    async verifyChildDoesNotExist(name: string): Promise<void> {
        await this.usersList.verifyUserDoesNotExist(name);
    }
}
