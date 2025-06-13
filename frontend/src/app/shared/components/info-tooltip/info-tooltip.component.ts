import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent {
  @Input() tooltipText: string = '';
  
  isVisible = false;
  tooltipX = 0;
  tooltipY = 0;

  constructor(private elementRef: ElementRef) {}

  showTooltip(event: MouseEvent): void {
    this.isVisible = true;
    this.updateTooltipPosition(event);
  }

  hideTooltip(): void {
    this.isVisible = false;
  }

  updateTooltipPosition(event: MouseEvent): void {
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY - 30;
    
    const tooltip = this.elementRef.nativeElement.querySelector('.tooltip');
    if (tooltip) {
      const rect = tooltip.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      if (this.tooltipX + rect.width > windowWidth) {
        this.tooltipX = event.clientX - rect.width - 10;
      }
      
      if (this.tooltipY < 0) {
        this.tooltipY = event.clientY + 20;
      }
    }
  }
}