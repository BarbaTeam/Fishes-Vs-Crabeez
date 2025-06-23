import { Component, Input, OnInit } from '@angular/core';
import { Grade, Grading } from 'src/app/shared/models/results.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildStatPageComponent } from 'src/app/pages/child/stat-page/child-stat-page.component';



@Component({
    selector: 'app-grading-line',
    templateUrl: './grading-line.component.html',
    styleUrls: ['./grading-line.component.scss']
})
export class GradingLineComponent implements OnInit {

    @Input()
    key!: string;

    @Input()
    grading!: Grading;

    @Input()
    improvement?: number;

    user!: User;
    isOnChildApp!: boolean;
    iconGrade: string = 'nograde';
    iconImprovement: string = '';
    bravoText: string = '';

    constructor(
        private userService: UserService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.isOnChildApp = this.route.component === ChildStatPageComponent;

        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });

        this.grading = {
            grade: this.grading.grade,
            accuracy: parseFloat(this.grading.accuracy.toFixed(2)),
        };

        if (this.improvement !== undefined) {
            this.improvement = parseFloat(this.improvement.toFixed(2));
        }

        switch (this.grading.grade) {
            case Grade.A_PLUS :
                this.iconGrade = 'diamond_coin';
                this.bravoText = 'Incroyable !';
                break;
            case Grade.A      :
                this.iconGrade = 'emerald_coin';
                this.bravoText = 'Bravo !';
                break;
            case Grade.A_MINUS:
                this.iconGrade = 'emerald_coin';
                this.bravoText = 'Bravo !';
                break;
            case Grade.B_PLUS :
                this.iconGrade = 'gold_coin';
                this.bravoText = 'Super !';
                break;
            case Grade.B      :
                this.iconGrade = 'gold_coin';
                this.bravoText = 'Super !';
                break;
            case Grade.B_MINUS:
                this.iconGrade = 'silver_coin';
                this.bravoText = 'Ouah !';
                break;
            case Grade.C_PLUS :
                this.iconGrade = 'silver_coin';
                this.bravoText = 'Ouah !';
                break;
            case Grade.C      :
                this.iconGrade = 'copper_coin';
                this.bravoText = 'Tous les meilleurs commencent quelque part !';
                break;
            case Grade.C_MINUS:
                this.iconGrade = 'copper_coin';
                this.bravoText = 'Tous les meilleurs commencent quelque part !';
                break;
            case Grade.D_PLUS :
                this.iconGrade = 'poop_coin';
                this.bravoText = 'Ne laches rien !';
                break;
        }
    }


    public gradeColor(): string {
        switch (this.grading.grade) {
            case Grade.A_PLUS : return 'blue';
            case Grade.A      : return 'green';
            case Grade.A_MINUS: return 'green';
            case Grade.B_PLUS : return 'gold';
            case Grade.B      : return 'gold';
            case Grade.B_MINUS: return 'grey';
            case Grade.C_PLUS : return 'grey';
            case Grade.C      : return 'orange';
            case Grade.C_MINUS: return 'orange';
            case Grade.D_PLUS : return 'brown';
            case Grade.XF     : return 'black';
            default: return 'black';
        }
    }
}
