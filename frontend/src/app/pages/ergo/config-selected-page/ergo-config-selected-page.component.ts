import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-ergo-config-selected-page',
  templateUrl: './ergo-config-selected-page.component.html',
  styleUrl: './ergo-config-selected-page.component.scss'
})
export class ErgoConfigSelectedPageComponent {

  user!: User;
  
  constructor(private userService: UserService) {
      this.userService.selectedUser$.subscribe((user: User) => {
          this.user = user;
      })
  }

  ngOnInit() {
      console.log(this.user);
  }  
  
}
