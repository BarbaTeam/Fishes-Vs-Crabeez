import { Component, Input, OnInit } from '@angular/core';
import { Grade, Grading } from 'src/app/shared/models/results.model';

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

    ngOnInit(): void {
        this.grading = {
            grade: this.grading.grade,
            accuracy: parseFloat(this.grading.accuracy.toFixed(2)),
        };

        if (this.improvement !== undefined) {
            this.improvement = parseFloat(this.improvement.toFixed(2));
        }
    }

    public gradeColor(): string {
        switch (this.grading.grade) {
            case Grade.A_PLUS : return 'gold';
            case Grade.A      : return 'green';
            case Grade.A_MINUS: return 'green';
            case Grade.B_PLUS : return 'lightblue';
            case Grade.B      : return 'lightblue';
            case Grade.B_MINUS: return 'lightblue';
            case Grade.C_PLUS : return 'blue';
            case Grade.C      : return 'blue';
            case Grade.C_MINUS: return 'blue';
            case Grade.D_PLUS : return 'orange';
            case Grade.D      : return 'orange';
            case Grade.D_MINUS: return 'orange';
            case Grade.F      : return 'red';
            case Grade.XF     : return 'black';
        }
    }
}
