import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Question, QuestionNotion } from 'src/app/shared/models/question.model';
import { MOCK_QUESTIONS } from 'src/app/shared/mocks/question.mock';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { GameEngine } from './game-engine';


type Input = {
    letter: string,
    status: "correct" | "wrong" | "pending",
};



////////////////////////////////////////////////////////////////////////////////
// Game :
////////////////////////////////////////////////////////////////////////////////

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    private static readonly INPUTS_END: Input = {
        letter: '\xa0', status: "pending"
    };

    public user!: User;

    public question: Question;
    private keydownHandler: (event: KeyboardEvent) => void;

    public expected_answerInputs: string[] = [];
    public proposed_answerInputs: string[] = [];
    public inputs: Input[] = [];

    public cursorPosition: number;
    
    @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;
    @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private gameEngine!: GameEngine;

    public score: number;
    private hasEnded: boolean;


    ////////////////////////////////////////////////////////////////////////////
    // Constructors & Destructors :

    constructor(private userService: UserService) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });

        this.question = QuestionsGenerator.genQuestion(this.questionMask);
        this.setupEncryptAudio();
        this.keydownHandler = this.checkInput.bind(this);

        this.expected_answerInputs = this.question.answer.split("");
        this.proposed_answerInputs = [];
        this.inputs = [];

        this.cursorPosition = 0;

        this.score = 0;

        this.hasEnded = false;
    }

    ngOnInit(): void {
        this.setupAudio();
        document.addEventListener("keydown", this.keydownHandler);
        this.updateInputs();
    }

    ngAfterViewInit(): void {
        this.setupFontSize(`${3 * this.user.userConfig.fontSize}rem`);

        const canvas = this.canvasRef.nativeElement;
        this.gameEngine = new GameEngine(this, canvas);
    }

    ngOnDestroy(): void {
        document.removeEventListener("keydown", this.keydownHandler);
        this.stopAudio();
        this.encryptAudio?.pause();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Getters :
    public get questionNotion(): QuestionNotion {
        return this.question.notion;
    }

    public get proposed_answer(): string {
        return this.proposed_answerInputs.join("");
    }

    // Mask : "ADDITION" | "SUBSTRACTION" | "MULTIPLICATION" | "DIVISION" | "REWRITING" | "ENCRYPTION" | "EQUATION"
    public get questionMask(): boolean[] {
        const userConfig = this.user.userConfig;
        return [
            userConfig.addition,
            userConfig.soustraction,
            userConfig.multiplication,
            userConfig.division,
            userConfig.numberRewrite,
            userConfig.encryption,
            userConfig.equation
        ];
    }

    private updateInputs(): void {
        const userConfig = this.user.userConfig;
        const showsAnswer = (
            userConfig.showsAnswer
            || this.question.notion == QuestionNotion.ENCRYPTION
        );

        const PENDING_SPACE: Input = {letter: '\xa0', status: "pending"};
        const CORRECT_SPACE: Input = {letter: '\xa0', status: "correct"};
        const WRONG_SPACE: Input = {letter: '·', status: "wrong"};

        let ret: Input[] = [];

        const LENGTH = Math.max(
            this.proposed_answerInputs.length,
            this.expected_answerInputs.length,
        );
        for (let i=0; i<LENGTH; i++) {
            const proposed_letter = this.proposed_answerInputs[i];
            const expected_letter = this.expected_answerInputs[i];

            if (proposed_letter === expected_letter) {
                ret[i] = (
                    (proposed_letter !== ' ')
                    ? {letter: proposed_letter, status: "correct"}
                    : CORRECT_SPACE
                );
            } else if (proposed_letter === undefined) {
                if (!showsAnswer) break;

                ret[i] = (
                    (expected_letter !== ' ')
                    ? {letter: expected_letter, status: "pending"}
                    : PENDING_SPACE
                );
            } else {
                ret[i] = (
                    (proposed_letter !== ' ')
                    ? {letter: proposed_letter, status: "wrong"}
                    : WRONG_SPACE
                );
            }
        }

        ret.push(GameComponent.INPUTS_END);

        this.inputs = ret;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    private gotoStart(): void {
        this.cursorPosition = 0;
    }

    private gotoEnd(): void {
        this.cursorPosition = this.proposed_answerInputs.length;
    }

    private moveToTheLeft(): void {
        if (this.cursorPosition == 0)
            return;
        this.cursorPosition--;
    }

    private moveToTheRight(): void {
        if (this.cursorPosition == this.proposed_answerInputs.length)
            return;
        this.cursorPosition++;
    }


    private deleteCurrentCharacter(): void {
        if (this.cursorPosition == this.proposed_answerInputs.length)
            return;
        this.proposed_answerInputs.splice(this.cursorPosition, 1);
    }

    private deletePreviousCharacter(): void {
        if (this.cursorPosition == 0)
            return;

        this.cursorPosition--;
        this.proposed_answerInputs.splice(this.cursorPosition, 1);
    }

    private submitAnswer(): void {
        if (AnswerChecker.checkAnswer(this.proposed_answer, this.question)){
            this.score++;
            this.gameEngine.answerCorrectly(this.gameEngine.playerInstance);
        }
        this.question = QuestionsGenerator.genQuestion(this.questionMask);
        this.setupEncryptAudio();

        if (this.question === undefined) {
            this.hasEnded = true;
            return;
        }

        this.expected_answerInputs = this.question.answer.split("");
        this.proposed_answerInputs = [];
        this.cursorPosition = 0;

        this.gameEngine.questionNotion = this.question.notion;
    }

    private writeCharacter(c: string): void {
        this.proposed_answerInputs.splice(
            this.cursorPosition++, 0, c
        );
    }

    private audio: HTMLAudioElement | null = null;

    private setupAudio(): void {
        if (!this.audio) {
            this.audio = new Audio('../../../../assets/sons/in-game-music.mp3');
            this.audio.loop = true;
            this.audio.volume = 0.5 * this.user.userConfig.sound;
        }
        this.audio.play();
    }

    private stopAudio(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; 
        }
    }

    private encryptAudio: HTMLAudioElement | null = null;
    private hasDecryptAudio: boolean = true;
    private setupEncryptAudio(): void {
        if(this.questionNotion === "ENCRYPTION"){
            this.playEncryptAudio();
            this.hasDecryptAudio = false;
        }   else if(!this.hasDecryptAudio){
            this.stopEncryptAudio();
            this.hasDecryptAudio = true;
        }
    }

    private stopEncryptAudio(): void {
        if (this.encryptAudio) {
            this.encryptAudio.pause();
            this.encryptAudio.currentTime = 0; 
            let decryptAudio = new Audio('../../../../assets/sons/decrypted.mp3');
            decryptAudio.volume = 0.5 * this.user.userConfig.sound;
            decryptAudio.play();
        }
    }

    private playEncryptAudio(): void {
        if (!this.encryptAudio) {
            this.encryptAudio = new Audio('../../../../assets/sons/encrypted.mp3');
            this.encryptAudio.loop = true;
            this.encryptAudio.volume = 0.5 * this.user.userConfig.sound;
        }
        this.encryptAudio.play();
    }

    private setupFontSize(size: string): void {
        if (this.headerRef) {
          this.headerRef.nativeElement.style.fontSize = size;
        }
    }

    private checkInput(event: KeyboardEvent): void {
        const keyPressed = event.key;

        switch (keyPressed) {
            case "Home" :
                this.gotoStart();
                break;

            case "End" :
                this.gotoEnd();
                break;

            case "ArrowLeft" :
                this.moveToTheLeft();
                break;

            case "ArrowRight" :
                this.moveToTheRight();
                break;

            case "Delete" :
                this.deleteCurrentCharacter();
                break;

            case "Backspace" :
                this.deletePreviousCharacter();
                break;

            case "Enter" :
                this.submitAnswer();
                break;

            default :
                if (keyPressed.length === 1) {
                    this.writeCharacter(keyPressed);
                }
                break;
        }
        this.updateInputs();
    }
}



////////////////////////////////////////////////////////////////////////////////
// Backend Simulator :
////////////////////////////////////////////////////////////////////////////////

import { num2words_fr, filterOnMask, randint } from "src/utils";

export class QuestionsGenerator {
    private static _chooseNotion(mask: boolean[]): QuestionNotion {
        const notions = Object.values(QuestionNotion);

        const allowedNotions = filterOnMask(notions, mask);
        if (allowedNotions.length === 0) {
            throw new Error("Aucune notion autorisée par le masque fourni.");
        }
        return allowedNotions[randint(0, allowedNotions.length - 1)];
    }

    private static _convertNotionToOperator(notion: QuestionNotion): string {
        switch (notion) {
            case QuestionNotion.ADDITION:
                return '+';
            case QuestionNotion.SUBSTRACTION:
                return '-';
            case QuestionNotion.MULTIPLICATION:
                return '*';
            case QuestionNotion.DIVISION:
                return '/';
            default:
                return 'NA';
        }
    }

    private static _chooseOperands(operandsAmount: number = 2, minBound: number = 0, maxBound: number = 10): number[] {
        const operands: number[] = [];
        for (let i = 0; i < operandsAmount; i++) {
            operands.push(randint(minBound, maxBound));
        }
        return operands;
    }

    private static _computeAnswer(operands: number[], operator: string): number {
        switch (operator) {
            case '+':
                return operands[0] + operands[1];
            case '-':
                return operands[0] - operands[1];
            case '*':
                return operands[0] * operands[1];
            case '/':
                // Division entière
                return Math.floor(operands[0] / operands[1]);
            default:
                throw new Error(`Unexpected operator: ${operator}`);
        }
    }

    private static _genEncryptedString(length: number): string {
        // TODO : utiliser l'ensemble complet des caractères si besoin
        const characters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}";

        let ret = "";
        for (let i = 0; i < length; i++) {
            ret += characters.charAt(randint(0, characters.length - 1));
        }
        return ret;
    }
 
    // Mask : "ADDITION" | "SUBSTRACTION" | "MULTIPLICATION" | "DIVISION" | "REWRITING" | "ENCRYPTION" | "EQUATION"
    public static genQuestion(notionMask: boolean[] = [true, true, false, false, false, false, false]): Question {
        const notion = this._chooseNotion(notionMask);

        switch (notion) {
            case QuestionNotion.REWRITING:
                const nb = randint(0, 50);
                return {
                    prompt: `${nb} :\xa0`,
                    answer: num2words_fr(nb),
                    notion: notion,
                };

            case QuestionNotion.ENCRYPTION:
                const length = randint(4, 6);
                return {
                    prompt: "",
                    answer: this._genEncryptedString(length),
                    notion: notion,
                };

            default:
                const operator = this._convertNotionToOperator(notion);
                const operands = this._chooseOperands();
                const ans = this._computeAnswer(operands, operator);
                return {
                    prompt: `${operands[0]} ${operator} ${operands[1]} =\xa0`,
                    //prompt: `${operands[0]} ${operator} ${operands[1]} =&nbsp;`,
                    answer: num2words_fr(ans),
                    notion: notion
                };
        }
    }
}


class AnswerChecker {
    public static checkAnswer(proposed_answer: string, question: Question): boolean {
        console.log(`is correct : ${proposed_answer === question.answer}`);
        return proposed_answer === question.answer;
    }
}