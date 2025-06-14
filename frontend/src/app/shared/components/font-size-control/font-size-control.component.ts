import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-font-size-control',
  templateUrl: './font-size-control.component.html',
  styleUrls: ['./font-size-control.component.scss']
})
export class FontSizeControlComponent {
  @Input() value: number = 0.5;
  @Input() minValue: number = 1;
  @Input() maxValue: number = 4;
  @Input() step: number = 1;
  @Output() valueChange = new EventEmitter<number>();

  increase(): void {
    if (this.value + this.step <= this.maxValue) {
      this.value += this.step;
      this.valueChange.emit(this.value);
    }
  }

  decrease(): void {
    if (this.value - this.step >= this.minValue) {
      this.value -= this.step;
      this.valueChange.emit(this.value);
    }
  }

  getFontSize(): number {
    return this.value;
  }
}
