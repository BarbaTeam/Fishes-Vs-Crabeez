import { Component, Input, OnInit } from '@angular/core';



@Component({
    selector: 'app-rollable-box',
    templateUrl: './rollable-box.component.html',
    styleUrl: './rollable-box.component.scss',
})
export class RollableBoxComponent implements OnInit{

    @Input()
    title!: string;

    private _isUnrolled = false;

    public isUnrolled(): boolean {
        return this._isUnrolled;
    }

    ngOnInit(): void {
        console.log(`title: ${this.title}`);
    }

    public toggle(): void {
        this._isUnrolled = !this._isUnrolled;
    }
}
