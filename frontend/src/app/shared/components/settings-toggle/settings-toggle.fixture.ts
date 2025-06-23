import { Locator, expect } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class SettingsToggleFixture extends E2EComponentFixture {
  getToggle(label: string): Locator {
    return this.page.locator(`span:has-text("${label}") label.settings-toggle`);
  }

  reecritureToggle(): Locator {
    return this.getToggle('Réécriture des nombres');
  }

  additionToggle(): Locator {
    return this.getToggle('Addition');
  }

  soustractionToggle(): Locator {
    return this.getToggle('Soustraction');
  }

  multiplicationToggle(): Locator {
    return this.getToggle('Multiplication');
  }

  divisionToggle(): Locator {
    return this.getToggle('Division');
  }

  reecritureCheckbox(): Locator {
    return this.reecritureToggle().locator('input[type="checkbox"]');
  }

  async toggleOption(option: 'reecriture' | 'addition' | 'soustraction' | 'multiplication' | 'division'): Promise<void> {
    const toggleMap = {
      reecriture: this.reecritureToggle(),
      addition: this.additionToggle(),
      soustraction: this.soustractionToggle(),
      multiplication: this.multiplicationToggle(),
      division: this.divisionToggle(),
    };
    
    await toggleMap[option].click();
  }

  async verifyToggleState(option: string, checked: boolean): Promise<void> {
    const toggle = this.getToggle(option);
    await expect(toggle).toBeVisible();
    
    if (checked) {
      const checkbox = toggle.locator('input[type="checkbox"]');
      await expect(checkbox).toBeChecked();
    }
  }
}
