import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/shared/services/user.service';
import { SocketService } from '@app/shared/services/socket.service';
import { GameEngine } from './game-engine';

import { User } from '@app/shared/models/user.model';
import { UserID } from '@app/shared/models/ids';
import { Question, QuestionNotion } from '@app/shared/models/question.model';



type Input = {
    letter: string,
    status: "correct" | "wrong" | "pending",
};



////////////////////////////////////////////////////////////////////////////////
// Game :
////////////////////////////////////////////////////////////////////////////////

@Component({
    selector: 'app-game-running-page',
    templateUrl: './game-running-page.component.html',
    styleUrls: ['./game-running-page.component.scss']
})
export class GameRunningPageComponent implements OnInit, OnDestroy {
    private static readonly INPUTS_END: Input = {
        letter: '\xa0', status: "pending"
    };

    private subscriptions = new Subscription();

    public user!: User;
    public question!: Question;
    
    public localPlayerIconUrl: string = '';
    public player1IconUrl: string = '';
    public player2IconUrl: string = '';
    public isEncrypted: boolean = false;

    private keydownHandler: (event: KeyboardEvent) => void;

    public expected_answerInputs: string[] = [];
    public proposed_answerInputs: string[] = [];
    public inputs: Input[] = [];

    public cursorPosition: number;

    @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;
    @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
    
    private gameEngine!: GameEngine;

    public personalScore: number;
    public generalScore: number;
    public health: number;
    public waveCounter: number;
    public bossWave: boolean;
    public bossHealth : number;
    public hasEnded: boolean;

    ////////////////////////////////////////////////////////////////////////////
    // Constructors & Destructors :

    constructor(
        private socket : SocketService,
        private userService: UserService,
        private router: Router,
    ) {
        this.keydownHandler = this.checkInput.bind(this);
        this.cursorPosition = 0;
        this.personalScore = 0;
        this.generalScore = 0;
        this.health = 10;
        this.waveCounter = 0;
        this.bossWave = false;
        this.bossHealth = 0;
        this.hasEnded = false;
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe((user: User) => {
                this.user = user;
            })
        );

        this.initSocket();
        document.addEventListener("keydown", this.keydownHandler);
        this.updateInputs();
    }

    private initSocket() {
        this.subscriptions.add(
            this.socket.on<Question>('newQuestion').subscribe(question => {
                console.log(`[CLIENT] : Player ${this.user.userId} received a new question ${question}`);
                this.question = question;
                this.inputs = [];
                this.expected_answerInputs = this.question.answer.split("");
                this.proposed_answerInputs = [];
                this.cursorPosition = 0;

                this.updateInputs();
            })
        );
    }

    ngAfterViewInit(): void {
        this.setupFontSize(`${3 * this.user.config.fontSize}rem`);

        const canvas = this.canvasRef.nativeElement;
        this.gameEngine = new GameEngine(canvas, this.socket, this.user.userId);
        this.subscriptions.add(
            this.gameEngine.localPlayerImageSrc$.subscribe(url => {
                this.localPlayerIconUrl = url;
            })
        );
        this.subscriptions.add(
            this.gameEngine.player1ImageSrc$.subscribe(url => {
                this.player1IconUrl = url;
            })
        );
        this.subscriptions.add(
            this.gameEngine.player2ImageSrc$.subscribe(url => {
                this.player2IconUrl = url;
            })
        );
        this.subscriptions.add(
            this.gameEngine.localPlayerPlayerParalysed$.subscribe(bool => {
                this.isEncrypted = bool;
            })
        );
        this.subscriptions.add(
            this.gameEngine.generalScore$.subscribe(score => {
                this.generalScore = score;
            })
        );
        this.subscriptions.add(
            this.gameEngine.health$.subscribe(health => {
                this.health = health;
            })
        );
        this.subscriptions.add(
            this.gameEngine.waveCounter$.subscribe(waveCounter => {
                this.waveCounter = waveCounter;
            })
        );
        this.subscriptions.add(
            this.gameEngine.bossWave$.subscribe(bossWave => {
                this.bossWave = bossWave;
            })
        );
        this.subscriptions.add(
            this.gameEngine.bossHealth$.subscribe(bossHealth => {
                this.bossHealth = bossHealth;
            })
        );
        this.subscriptions.add(
            this.gameEngine.hasEnded$.subscribe(hasEnded => {
                this.hasEnded = hasEnded;
                console.log("hasEnded received:", hasEnded, typeof hasEnded);            
            })
        );
    }

    ngOnDestroy(): void {
        document.removeEventListener("keydown", this.keydownHandler);
    }

    public quit() {
        this.router.navigate(['/child/games-list']);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Getters :
    public get proposed_answer(): string {
        return this.proposed_answerInputs.join("");
    }

    private updateInputs(): void {
        const showsAnswer = (
            this.user.config.showsAnswer
            || this.question?.notion == QuestionNotion.ENCRYPTION
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

        ret.push(GameRunningPageComponent.INPUTS_END);

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
        console.log("Enter key pressed !")
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
