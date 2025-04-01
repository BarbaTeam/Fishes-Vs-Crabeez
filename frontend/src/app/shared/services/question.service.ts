import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Question } from "../models/question.model";
import { MOCK_QUESTIONS } from "../mocks/question.mock";

@Injectable({
    providedIn: 'root'
})
export class QuestionService{
    // TODO : Removing it once the back-end is able to send questions
    private _mock_idx: number;

    public question$!: BehaviorSubject<Question>;

    constructor() {
      this._mock_idx = 0;
      this.question$ = new BehaviorSubject(MOCK_QUESTIONS[0]);
    }

    public loadNewQuestion(): void {
        // TODO : Using websockets to fetch a question once it's possible
        this._mock_idx++;
        this.question$.next(MOCK_QUESTIONS[this._mock_idx]);
    }
}
