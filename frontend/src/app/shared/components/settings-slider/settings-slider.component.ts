import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, AfterViewInit } from '@angular/core';



@Component({
    selector: 'app-settings-slider',
    templateUrl: './settings-slider.component.html',
    styleUrls: ['./settings-slider.component.scss']
})
export class SettingsSliderComponent implements AfterViewInit {
    @Input()
    value: number = 0;

    @Output()
    valueChange = new EventEmitter<number>();

    @ViewChild('slider')
    sliderRef!: ElementRef;

    @ViewChild('head')
    headRef!: ElementRef;

    @ViewChild('line')
    lineRef!: ElementRef;


    isDragging = false;

    ngAfterViewInit() {
        this.setPositionFromValue();
    }

    private setPositionFromValue() {
        const slider = this.sliderRef.nativeElement;
        const head = this.headRef.nativeElement;
        const line = this.lineRef.nativeElement;
        const width = slider.offsetWidth;
        head.style.left = `${this.value * width}px`;
        const r = Math.round(204 + (255 - 204) * this.value);
        const g = Math.round(204 + (212 - 204) * this.value);
        const b = Math.round(204 + (102 - 204) * this.value);

        head.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        line.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    }

    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        event.preventDefault();
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.isDragging = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isDragging) return;

        const slider = this.sliderRef.nativeElement;
        const head = this.headRef.nativeElement;
        const rect = slider.getBoundingClientRect();

        let pos = event.clientX - rect.left;
        pos = Math.max(0, Math.min(pos, rect.width));
        head.style.left = pos + 'px';

        this.value = pos / rect.width;
        this.setPositionFromValue();
        this.valueChange.emit(this.value);
    }

    onClickSlider(event: MouseEvent) {
        const slider = this.sliderRef.nativeElement;
        const head = this.headRef.nativeElement;
        const rect = slider.getBoundingClientRect();

        let pos = event.clientX - rect.left;
        pos = Math.max(0, Math.min(pos, rect.width));
        head.style.left = pos + 'px';

        this.value = pos / rect.width;
        this.valueChange.emit(this.value);
  }
}
