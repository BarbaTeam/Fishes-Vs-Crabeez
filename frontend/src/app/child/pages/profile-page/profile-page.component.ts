import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { assert } from '@app/utils';

// Services :
import { UserService } from '@app/shared/services/user.service';
import { PlayerStatisticsService } from '@app/shared/services/player-statistics.service';
import { PlayerResultsService } from '@app/shared/services/player-results.service';
import { LeaderboardService } from '@app/shared/services/leaderboard.service';
import { GameInfoService } from '@app/shared/services/game-info.service';

// Types :
import { User } from '@app/shared/models/user.model';
import { PlayerResults, PlayerStatistics } from '@app/shared/models/player-results.model';
import { QuestionNotion } from '@app/shared/models/question.model';
import { Grading } from '@app/shared/models/results.model';
import { GameLeaderboard, GlobalLeaderboard, Leaderboard } from '@app/shared/models/leaderboard.model';
import { GameInfo } from '@app/shared/models/game-info.model';



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
    leaderboard: Leaderboard | undefined
};
type HistorySectionData = {
    gameInfo: GameInfo,
    playerResults: PlayerResults,
    leaderboard: Leaderboard | undefined,
};



@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    public user!: User;

    public subscriptions = new Subscription();
    public currSection: Section = 0;

    // Statistics Section Data :
    private _playerStatistics!: PlayerStatistics;
    private _globalLeaderboard!: GlobalLeaderboard;

    // History Sections Data :
    private _playerResultsList!: PlayerResults[];
    private _gameLeaderboardList!: GameLeaderboard[];

    public gamesInfos!: GameInfo[];

    public sectionData: HistorySectionData | StatsSectionData | InvalidSectionData;


    constructor(
        private userService: UserService,
        private playerStatisticsService :PlayerStatisticsService,
        private playerResultsService: PlayerResultsService,
        private gameInfoService: GameInfoService,
        private leaderboardService: LeaderboardService,
        private route: ActivatedRoute,
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(
            (user: User) => {
                this.user = user;
            })
        );

        this.subscriptions.add(
            this.playerStatisticsService.playerStatistics$.subscribe(
            (playerStatistics: PlayerStatistics|null) => {
                if (playerStatistics) this._playerStatistics = playerStatistics;
            })
        );

        this.subscriptions.add(
            this.leaderboardService.globalLeaderboard$.subscribe(
            (globalLeaderboard: GlobalLeaderboard) => {
                this._globalLeaderboard = globalLeaderboard;
                this._updateSectionData();
            })
        );

        this.subscriptions.add(
            this.playerResultsService.playerResultsList$.subscribe(
            (playerResultsList: PlayerResults[]) => {
                this._playerResultsList = playerResultsList;
            })
        );

        const gameIdsStream$ = this.playerResultsService.playerResultsList$.pipe(
            map((playerResultsList) => playerResultsList.map(pr => pr.gameId)),
        );

        const gamesInfos$ = gameIdsStream$.pipe(
            switchMap((gameIds) =>
                (gameIds.length > 0)
                ? combineLatest(gameIds.map(
                    id => (
                        this.gameInfoService.getGameInfoById$(id)
                    ) as Observable<GameInfo>
                ))
                : of([])
            )
        )

        const gamesLeaderboards$ = gameIdsStream$.pipe(
            switchMap((gameIds) =>
                (gameIds.length > 0)
                ? combineLatest(gameIds.map(
                    id => (
                        this.leaderboardService.getGameLeaderboardById$(id)
                    ) as Observable<GameLeaderboard>
                ))
                : of([])
            )
        )

        this.subscriptions.add(
            gamesInfos$.subscribe((gamesInfos) => {
                this.gamesInfos = gamesInfos as GameInfo[];
            })
        );

        this.subscriptions.add(
            gamesLeaderboards$.subscribe((gameLeaderboardList) => {
                this._gameLeaderboardList = gameLeaderboardList as GameLeaderboard[];
            })
        );
    }


    ngOnInit() {
        this.subscriptions.add(
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
            })
        );
    }

    ngOnDestroy(): void {
        //this.subscriptions.unsubscribe();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Operations :

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
            return;
        }

        assert(this.isInHistorySections());

        const historySectionId = this.currSection - 1;
        this.sectionData = {
            gameInfo: this.gamesInfos[historySectionId],
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
}



////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////

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
