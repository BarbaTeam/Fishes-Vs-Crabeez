import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-ergo-config-selected-page',
  templateUrl: './ergo-config-selected-page.component.html',
  styleUrls: ['./ergo-config-selected-page.component.scss']
})
export class ErgoConfigSelectedPageComponent implements OnInit {

    user!: User;
    userTemp!: User;
    showSuccess = false;
    showDeleted = false;

    constructor( private userService: UserService, private router: Router) {}

    ngOnInit(): void {
        this.userService.selectedUser$.subscribe((user: User) => {
          this.user = user;
        });
    }

    onUserTempChanged(updatedUser: User): void {
        this.userTemp = updatedUser;
    }

    saveChanges(): void {
        if (this.userTemp) {
            this.userService.saveChanges(this.userTemp);
            this.showSuccess = true;
            setTimeout(() => {
                this.showSuccess = false;
            }, 2000);
        }
    }

    back(): void {
        this.router.navigate(['/ergo-list']);
    }

    removeSafety(): void {
        this.showDeleted = true;
    }
    putSafety(): void {
        this.showDeleted = false;
    }
    removeUser(): void {
        this.userService.removeUser(this.userTemp);
        this.router.navigate(['/ergo-list']);
    }
}
