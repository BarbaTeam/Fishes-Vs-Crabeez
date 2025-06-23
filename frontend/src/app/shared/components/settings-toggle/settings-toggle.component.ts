import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.scss']
})
export class SettingsToggleComponent implements OnInit {
    @Input() checked: boolean = false;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
      this.cdr.detectChanges();
    }
}
