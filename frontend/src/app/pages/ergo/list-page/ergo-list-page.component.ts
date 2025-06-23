import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'ergo-list-page',
  templateUrl: './ergo-list-page.component.html',
  styleUrl: './ergo-list-page.component.scss'
})
export class ErgoListPageComponent {
    public userBlank: User;


    constructor(private userService: UserService, private router: Router){
        this.userBlank = {
            userId:`u${Math.floor(Math.random() * 1000)}`,
            name: "New Player",
            age: "",
            icon: "unknown.png",
            userConfig: {
                showsAnswer: false,
                readingAssistance: false,
                advancedStats: false,
                leaderBoard: false,
                fontSize: 0.5,
                sound: 0.5,
                numberRewrite: false,
                addition: false,
                soustraction: false,
                multiplication: false,
                division: false,
                encryption: false,
                equation: false,
            }
        };
    }
    
    public addNewUser(): void {
        this.router.navigate(['/ergo-config-form']);
    }

}
