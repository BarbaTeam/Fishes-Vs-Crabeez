import { Component, Input, OnInit } from '@angular/core';

import { Grade, Grading } from '@app/shared/models/results.model';
import { assert } from '@app/utils';



const StatLineState = {
    WPM_LINE: "WPM_LINE",
    GRADING_LINE: "GRADING_LINE",
} as const;
type StatLineState = typeof StatLineState[keyof typeof StatLineState];



@Component({
    selector: 'app-stat-line',
    templateUrl: './stat-line.component.html',
    styleUrls: ['./stat-line.component.scss']
})
export class StatLineComponent implements OnInit {
    private state!: StatLineState;

    @Input()
    title!: string;

    @Input()
    value!: number | Grading;

    @Input()
    improvement?: number;

    @Input()
    withAdvancedStats?: boolean;

    ngOnInit(): void {
        if (typeof this.value === "number") {
            this.state = StatLineState.WPM_LINE;
        } else {
            this.state = StatLineState.GRADING_LINE;
        }

        if (this.withAdvancedStats === undefined) {
            this.withAdvancedStats = false;
        }

        if (this.improvement !== undefined) {
            this.improvement = parseFloat(this.improvement.toFixed(2));
        } else {
            this.improvement = 0;
        }
    }

    public isGradingline(): this is this & { value: Grading } {
        return this.state === StatLineState.GRADING_LINE;
    }

    public isWPMLine(): this is this & { value: number } {
        return this.state === StatLineState.WPM_LINE;
    }

    public get gradeIcon(): string {
        assert(this.isGradingline());

        const ICON_PATH = "../../../../assets/images/icons/grading";

        switch (this.value.grade) {
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
