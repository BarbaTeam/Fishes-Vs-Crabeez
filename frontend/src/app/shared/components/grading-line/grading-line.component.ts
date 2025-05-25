import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { isInErgoPage } from '@app/utils/component-inspect';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';
import { Grade, Grading } from '@app/shared/models/results.model';



@Component({
    selector: 'app-grading-line',
    templateUrl: './grading-line.component.html',
    styleUrls: ['./grading-line.component.scss']
})
export class GradingLineComponent implements OnInit, OnDestroy {

    @Input()
    key!: string;

    @Input()
    grading!: Grading;

    @Input()
    improvement!: number | undefined;

    private user!: User;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });

        this.grading = {
            grade: this.grading.grade,
            accuracy: parseFloat(this.grading.accuracy.toFixed(2)),
        };

        if (this.improvement !== undefined) {
            this.improvement = parseFloat(this.improvement.toFixed(2));
        } else {
            this.improvement = 0;
        }
    }

    ngOnDestroy(): void {
        // TODO : Free subscription to 'userService'
    }


    public get advancedStatsActivated(): boolean {
        return (
            isInErgoPage(this.route, this.router)
            || this.user.userConfig.advancedStats
        );
    }


    public get gradeIcon(): string {
        const ICON_PATH = "../../../../assets/images/icons/grading";

        switch (this.grading.grade) {
            case Grade.S : return ICON_PATH + "/S_icon.png";
            case Grade.A : return ICON_PATH + "/A_icon.png";
            case Grade.B : return ICON_PATH + "/B_icon.png";
            case Grade.C : return ICON_PATH + "/C_icon.png";
            case Grade.D : return ICON_PATH + "/D_icon.png";
            case Grade.E : return ICON_PATH + "/E_icon.png";
            case Grade.F : return ICON_PATH + "/F_icon.png";
            case Grade.XF: return ICON_PATH + "/nograde.png";
            default: throw new Error("Should never happen");
        }
    }
}
