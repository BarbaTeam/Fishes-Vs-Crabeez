import { Component, Input } from '@angular/core';



@Component({
    selector: 'app-rollable-box',
    templateUrl: './rollable-box.component.html',
    styleUrl: './rollable-box.component.scss',
})
export class RollableBoxComponent {

    @Input()
    title!: string;

    private _isUnrolled = false;

    public isUnrolled(): boolean {
        return this._isUnrolled;
    }

    public toggle(): void {
        this._isUnrolled = !this._isUnrolled;
    }
}
