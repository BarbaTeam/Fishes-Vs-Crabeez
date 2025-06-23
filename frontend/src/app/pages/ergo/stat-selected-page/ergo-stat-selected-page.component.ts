import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { assert } from 'src/utils';

// Services :
import { UserService } from 'src/app/shared/services/user.service';
import { PlayerStatisticsService } from 'src/app/shared/services/player-statistics.service';
import { PlayerResultsService } from 'src/app/shared/services/player-results.service';
import { LeaderboardService } from 'src/app/shared/services/leaderboard.service';
import { GameInfoService } from 'src/app/shared/services/game-info.service';

// Types :
import { User } from 'src/app/shared/models/user.model';
import { PlayerResults, PlayerStatistics } from 'src/app/shared/models/player-results.model';
import { AnsweredQuestion, QuestionNotion } from 'src/app/shared/models/question.model';
import { Grading } from 'src/app/shared/models/results.model';
import { GameLeaderboard, GlobalLeaderboard, Leaderboard } from 'src/app/shared/models/leaderboard.model';
import { GameInfo } from 'src/app/shared/models/game-log.model';



const Section = {
    INVALID_SECTION: -1,
    STATS_SECTION: 0,
    HISTORY_SECTION_1: 1,
    HISTORY_SECTION_2: 2,
    HISTORY_SECTION_3: 3,
    HISTORY_SECTION_4: 4,
    HISTORY_SECTION_5: 5,
} as const;
type Section = typeof Section[keyof typeof Section];

type InvalidSection = typeof Section.INVALID_SECTION;
type StatsSection = typeof Section.STATS_SECTION;
type HistorySection = typeof Section[Extract<keyof typeof Section, `HISTORY_SECTION_${number}`>];


type InvalidSectionData = undefined;
type StatsSectionData = {
    playerStats: PlayerStatistics,
    leaderboard: Leaderboard | undefined,
};
type HistorySectionData = {
    gameInfo: GameInfo,
    playerResults: PlayerResults,
    leaderboard: Leaderboard | undefined,
};



@Component({
    selector: 'app-ergo-stat-selected-page',
    templateUrl: './ergo-stat-selected-page.component.html',
    styleUrl: './ergo-stat-selected-page.component.scss'
})
export class ErgoStatSelectedPageComponent implements OnInit {
    public user!: User;

    // Statistics Section Data :
    private _playerStatistics!: PlayerStatistics;
    private _globalLeaderboard!: GlobalLeaderboard;

    // History Sections Data :
    private _playerResultsList!: PlayerResults[];
    private _gameInfoList!: GameInfo[];
    private _gameLeaderboardList!: GameLeaderboard[];

    public availableHistorySections!: Section[];
    public currSection: Section;
    public sectionData: HistorySectionData | StatsSectionData | InvalidSectionData;

    constructor(
        private userService: UserService,
        private playerStatisticsService :PlayerStatisticsService,
        private playerResultsService: PlayerResultsService,
        private gameInfoService: GameInfoService,
        private leaderboardService: LeaderboardService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.currSection = 0;

        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });


        this.playerStatisticsService.playerStatistics$.subscribe(
            (playerStatistics: PlayerStatistics) => {
                this._playerStatistics = playerStatistics;
            }
        )

        this.leaderboardService.globalLeaderBoard$.subscribe(
            (globalLeaderboard: GlobalLeaderboard) => {
                this._globalLeaderboard = globalLeaderboard;
            }
        )

        this.playerResultsService.playerResultsList$.subscribe(
            (playerResultsList: PlayerResults[]) => {
                this._playerResultsList = playerResultsList;
            }
        );

        const gameIdsStream$ = this.playerResultsService.playerResultsList$.pipe(
            map((playerResultsList) => playerResultsList.map(pr => pr.gameId)),
        );

        gameIdsStream$.pipe(
            switchMap((gameIds) =>
                (gameIds.length > 0)
                ? combineLatest(gameIds.map(
                    id => this.gameInfoService.getInfo$(id)
                ))
                : of([])
            )
        ).subscribe((gameInfoList) => {
            this._gameInfoList = gameInfoList as GameInfo[];
            this._updateAvailableHistorySections();
        });

        gameIdsStream$.pipe(
            switchMap((gameIds) =>
                (gameIds.length > 0)
                ? combineLatest(gameIds.map(
                    id => this.leaderboardService.getLeaderboard$(id)
                ))
                : of([])
            )
        ).subscribe((gameLeaderboardList) => {
            this._gameLeaderboardList = gameLeaderboardList as GameLeaderboard[];
        });
    }


    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            if (params['section'] === undefined) {
                this.currSection = Section.STATS_SECTION;
                this._updateSectionData();
                return;
            }

            const section = parseInt(params['section'], 10);

            if (
                isNaN(section)
                || section < 0
                || Math.min(this._playerResultsList.length, 5) < section
            ) {
                // NOTE : We might support accessing more than 5 results later.
                // However, we currently will only support displaying at most
                // the 5 latest player results.
                this.currSection = Section.INVALID_SECTION;
                return;
            }

            this.currSection = section as Section;
            this._updateSectionData();
        });
    }


    ////////////////////////////////////////////////////////////////////////////
    // Operations :

    private _updateAvailableHistorySections(): void {
        this.availableHistorySections = [
            ...Array(Math.min(this._playerResultsList.length, 5)).keys()
        ] as Section[];
    }

    private _updateSectionData(): void {
        if (this.isInInvalidSection()) {
            this.sectionData = undefined;
            return;
        }

        if (this.isInStatsSection()) {
            this.sectionData = {
                playerStats: this._playerStatistics,
                leaderboard: this._globalLeaderboard,
            }

            let r = this.sectionData.playerStats.statistics.mostCommonMistakes.spelling.map(m => m[0])
            return;
        }

        assert(this.isInHistorySections());

        const historySectionId = this.currSection - 1;
        this.sectionData = {
            gameInfo: this._gameInfoList[historySectionId],
            playerResults: this._playerResultsList[historySectionId],
            leaderboard: this._gameLeaderboardList[historySectionId],
        }
    }


    ////////////////////////////////////////////////////////////////////////////
    // Getter :

    public get notionGradings(): {
        key: string,
        grading: Grading,
        improvement?: number,
    }[] {
        assert(
            this.isInStatsSection() || this.isInHistorySections(),
            "notionGrading must only be accessed "
            + "when initialising history sections "
            + "or statistics section"
        );

        let allNotionGradings: [QuestionNotion, Grading][];

        if (this.isInStatsSection()) {
            allNotionGradings = Object.entries(
                this.sectionData.playerStats.statistics.gradingPerNotion
            ) as [QuestionNotion, Grading][];

            let ret = [];

            for (const [notion , grading] of allNotionGradings) {
                if (grading.grade === 'XF') {
                    continue;
                }

                ret.push({
                    key: mapQuestionNotionToName(notion),
                    grading: grading,
                    improvement: this.sectionData.playerStats.statistics.accuracyImprovementPerNotion[notion]
                })
            }

            return ret;
        }

        assert(this.isInHistorySections());

        allNotionGradings = Object.entries(
            this.sectionData.playerResults.results.gradingPerNotion
        ) as [QuestionNotion, Grading][];

        let ret = [];

        for (const [notion , grading] of allNotionGradings) {
            if (grading.grade === 'XF') {
                continue;
            }

            ret.push({
                key: mapQuestionNotionToName(notion),
                grading: grading,
            })
        }

        return ret;
    }

    public getFormattedGameDateByIndex(idx: number, detailed: boolean = false): string {
        let date = new Date(this._gameInfoList[idx].date);
        return formatDate(date, detailed);
    }

    public getFormattedGameDate(detailed: boolean = false): string {
        assert(this.isInHistorySections())
        let date = new Date(this.sectionData.gameInfo.date);
        return formatDate(date, detailed);
    }

    /**
     * Don't call it outside of statistics section.
     */
    public getMostCommonMistakesSimplified(): {
        spelling: AnsweredQuestion[],
        calculation: AnsweredQuestion[],
    } {
        assert(this.isInStatsSection());
        return {
            spelling: this.sectionData.playerStats.statistics.mostCommonMistakes.spelling.map(m => m[0]),
            calculation: this.sectionData.playerStats.statistics.mostCommonMistakes.calculation.map(m => m[0]),
        };
    }

    /**
     * Don't call it outside of statistics section.
     */
    public getMostRecentMistakesSimplified(): {
        spelling: AnsweredQuestion[],
        calculation: AnsweredQuestion[],
    } {
        assert(this.isInStatsSection());
        return {
            spelling: this.sectionData.playerStats.statistics.mostRecentMistakes.spelling.map(m => m[0]),
            calculation: this.sectionData.playerStats.statistics.mostRecentMistakes.calculation.map(m => m[0]),
        };
    }


    ////////////////////////////////////////////////////////////////////////////
    // Checkers :

    public isInInvalidSection(): this is {
        currSection: InvalidSection,
        sectionData: InvalidSectionData,
    } {
        return this.currSection === Section.INVALID_SECTION;
    }

    public isInStatsSection(): this is {
        currSection: StatsSection,
        sectionData: StatsSectionData,
    } {
        return this.currSection === Section.STATS_SECTION;
    }

    public isInHistorySections(): this is {
        currSection: HistorySection,
        sectionData: HistorySectionData,
    } {
        return this.currSection > Section.STATS_SECTION;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Other :

    public back(): void {
        this.router.navigate(['/ergo-list']);
    }
}



function mapQuestionNotionToName(notion: QuestionNotion): string {
    switch (notion) {
        case QuestionNotion.ADDITION      : return "Addition";
        case QuestionNotion.SUBSTRACTION  : return "Soustraction";
        case QuestionNotion.MULTIPLICATION: return "Multiplication";
        case QuestionNotion.DIVISION      : return "Division";
        case QuestionNotion.EQUATION      : return "Equation";
        case QuestionNotion.REWRITING     : return "Réécriture";
        case QuestionNotion.ENCRYPTION    : return "Encodage";
    }
}

function formatDate(date: Date, detailed: boolean = false): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() est 0-indexé
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (detailed) {
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`
}
