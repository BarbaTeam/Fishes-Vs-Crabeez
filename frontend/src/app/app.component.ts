import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'Hello world!';
  public showSuccess = false;

  constructor() {}

  showHideSuccess() {
    this.showSuccess = !this.showSuccess;
  }
}
