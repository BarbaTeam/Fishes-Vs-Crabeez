import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class NavbarButtonFixture extends E2EComponentFixture{
  locator(text: string): Locator {
    return this.page.locator('app-navbar-button').filter({ hasText: text });
  }

  playerList(): Locator {
    return this.locator('Liste des joueurs');
  }

  gamesManager(): Locator {
    return this.locator('Gestionnaire de parties');
  }

  home(): Locator {
    return this.locator('Accueil');
  }

  back(): Locator {
    return this.page.locator('app-navbar-button.red').filter({ hasText: 'Retour' });
  }

  config(): Locator {
    return this.locator('Configuration');
  }

  create(): Locator {
    return this.locator('Créer');
  }
}