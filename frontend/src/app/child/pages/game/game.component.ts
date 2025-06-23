import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@app/shared/services/user.service';
import { GameEngine } from './game-engine';

import { User } from '@app/shared/models/user.model';
import { Question, QuestionNotion } from '@app/shared/models/question.model';
import { Router } from '@angular/router';
import { SocketService } from '@app/shared/services/socket.service';



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

    private subscriptions = new Subscription();

    public user!: User;
    public question!: Question;

    private keydownHandler: (event: KeyboardEvent) => void;

    public expected_answerInputs: string[] = [];
    public proposed_answerInputs: string[] = [];
    public inputs: Input[] = [];

    public cursorPosition: number;

    @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;
    @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private gameEngine!: GameEngine;

    public score: number;


    ////////////////////////////////////////////////////////////////////////////
    // Constructors & Destructors :

    constructor(
        private userService: UserService,
        private router: Router,
        private socket : SocketService,
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });

        this.setupEncryptAudio();
        this.keydownHandler = this.checkInput.bind(this);

        this.cursorPosition = 0;

        this.score = 0;

    }

    ngOnInit(): void {
        this.initSocket();
        this.socket.sendMessage('requestQuestion');
        this.setupAudio();
        document.addEventListener("keydown", this.keydownHandler);
        this.updateInputs();
    }

    private initSocket() {
        this.subscriptions.add(
            this.socket.on<Question>('newQuestion').subscribe(question => {
                this.question = question;
                this.inputs = [];
                this.expected_answerInputs = this.question.answer.split("");
                this.proposed_answerInputs = [];
                this.cursorPosition = 0;
            })
        )
    }

    ngAfterViewInit(): void {
        this.setupFontSize(`${3 * this.user.config.fontSize}rem`);

        const canvas = this.canvasRef.nativeElement;
        this.gameEngine = new GameEngine(canvas);
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

    public get questionMask(): Record<QuestionNotion, boolean> {
        return this.user.config.notionsMask;
    }

    private updateInputs(): void {
        const showsAnswer = (
            this.user.config.showsAnswer
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
        const answer = {
            prompt : this.question.prompt,
            expected_answer : this.question.answer,
            proposed_answer : this.proposed_answer,
            notion : this.question.notion,
        }
        this.socket.sendMessage('sendAnswer', (answer));
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
            this.audio.volume = 0.5 * this.user.config.sound;
        }
        this.audio.play();
    }

    public stopAudio(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    public encryptAudio: HTMLAudioElement | null = null;
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

    public stopEncryptAudio(): void {
        if (this.encryptAudio) {
            this.encryptAudio.pause();
            this.encryptAudio.currentTime = 0;
            let decryptAudio = new Audio('../../../../assets/sons/decrypted.mp3');
            decryptAudio.volume = 0.5 * this.user.config.sound;
            decryptAudio.play();
        }
    }

    private playEncryptAudio(): void {
        if (!this.encryptAudio) {
            this.encryptAudio = new Audio('../../../../assets/sons/encrypted.mp3');
            this.encryptAudio.loop = true;
            this.encryptAudio.volume = 0.5 * this.user.config.sound;
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

            case "ArrowUp":
                this.socket.sendMessage('changeLane', ("UP"));
                break;

            case "ArrowDown":
                this.socket.sendMessage('changeLane', ("DOWN"));
                break;

            default :
                if (keyPressed.length === 1) {
                    this.writeCharacter(keyPressed);
                }
                break;
        }
        this.updateInputs();
    }

    public back(){
        this.router.navigate(["/child"]);
    }
}
