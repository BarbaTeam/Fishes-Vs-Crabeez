import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-expandable-button',
  templateUrl: './expandable-button.component.html',
  styleUrls: ['./expandable-button.component.scss']
})
export class ExpandableButtonComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() mode: 'solo' | 'multi' = 'solo';
  @Input() expanded: boolean = false;
  @Input() hidden: boolean | null = false; 
  @Input() imageUrl: string = '';
  @Input() description: string = '';

  @Output() expand = new EventEmitter<'solo' | 'multi'>();
  @Output() launch = new EventEmitter<'solo' | 'multi'>();

  onClick() {
    if (!this.expanded) {
      this.expand.emit(this.mode);
    }
  }

  onLaunch() {
    this.launch.emit(this.mode);
  }
}
