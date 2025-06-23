import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sound-control',
  templateUrl: './sound-control.component.html',
  styleUrls: ['./sound-control.component.scss']
})
export class SoundControlComponent {
  @Input() value: number = 5;
  @Input() minValue: number = 0;
  @Input() maxValue: number = 5;
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

  testSound(): void {
    if (this.value < 1) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); 
    gainNode.gain.setValueAtTime((this.value / this.maxValue) * 0.3, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2); 
  }
}
