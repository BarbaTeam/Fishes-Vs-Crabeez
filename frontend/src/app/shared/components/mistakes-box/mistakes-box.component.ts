import { Component, Input } from '@angular/core';

import { AnsweredQuestion } from '../../models/question.model';



type Mistakes = {
    spelling: AnsweredQuestion[],
    calculation: AnsweredQuestion[],
}



@Component({
    selector: 'app-mistakes-box',
    templateUrl: './mistakes-box.component.html',
    styleUrl: './mistakes-box.component.scss'
})
export class MistakesBoxComponent {

    @Input()
    title!: string;

    @Input()
    mistakes!: Mistakes;


    public get spellingMistakes(): {
        expected: string,
        proposed: string,
    }[] {
        let ret = [];

        for (let ans of this.mistakes.spelling) {
            ret.push({
                expected: ans.expected_answer,
                proposed: ans.proposed_answer,
            });
        }

        return ret;
    }


    public get calculationMistakes(): {
        prompt: string,
        expected: string,
        proposed: string,
    }[] {
        let ret = [];

        for (let ans of this.mistakes.calculation) {
            ret.push({
                prompt: ans.prompt,
                expected: ans.expected_answer,
                proposed: ans.proposed_answer,
            });
        }

        return ret;
    }
}
