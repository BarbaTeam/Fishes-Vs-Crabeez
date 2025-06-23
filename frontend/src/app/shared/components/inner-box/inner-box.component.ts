import { Component } from '@angular/core';

@Component({
  selector: 'app-inner-box',
  template:`<ng-content/>`,
  styleUrl: './inner-box.component.scss'
})
export class InnerBoxComponent {}
