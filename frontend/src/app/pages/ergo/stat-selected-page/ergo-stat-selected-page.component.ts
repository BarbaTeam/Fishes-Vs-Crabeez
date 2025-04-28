import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ergo-stat-selected-page',
  templateUrl: './ergo-stat-selected-page.component.html',
  styleUrl: './ergo-stat-selected-page.component.scss'
})
export class ErgoStatSelectedPageComponent {
      
    constructor(private router: Router) {}
  
    back(): void {
        this.router.navigate(['/ergo-list']);
    }
}
