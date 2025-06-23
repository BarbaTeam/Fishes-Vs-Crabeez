import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.scss']
})
export class SettingsToggleComponent {
    @Input() checked: boolean = false;
    @Output() checkedChange = new EventEmitter<Boolean>();

    onToggle(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.checked = inputElement.checked;
        this.checkedChange.emit(this.checked);
    }
}
