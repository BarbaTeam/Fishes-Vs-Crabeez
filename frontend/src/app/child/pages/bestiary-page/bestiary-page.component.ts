import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



const ENEMY_ICON_PATH = '../../../../assets/images/game/enemy/';



interface EnemyStats {
    hp: number,
    attack: number,
    speed: number,
}

interface Monster {
    id: string,
    name: string,
    icon: string,

    score: number,
    stats: EnemyStats,

    isBoss: boolean,

    description: string,
    tips: string,

    discovered: boolean,
}



@Component({
    selector: 'app-bestiary-page',
    templateUrl: './bestiary-page.component.html',
    styleUrls: ['./bestiary-page.component.scss']
})
export class BestiaryPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    public user!: User;

    public readonly monsters: Monster[] = [
        {
            id: 'crab',
            name: 'Crab',
            icon: ENEMY_ICON_PATH + "crab_32x32.png",

            description: 'Crabe commun faible individuellement mais dangereux en groupe.',
            tips: 'Ne vous laissez pas déborder.',

            score: 10,
            stats: {
                hp: 1,
                attack: 1,
                speed: 0.1,
            },

            isBoss: false,

            discovered: true,
        }, {
            id: 'hive-crab',
            name: 'Hive Crab',
            icon: ENEMY_ICON_PATH + "hiveCrab_64x64.png",

            description: 'Crabe brut et lent. Fait apparaître des drones lorsqu\'il meurt.',
            tips: 'Lent et vulnérable, prenant votre temps et débarassez vous des autres ennemis.',

            score: 50,
            stats: {
                hp: 3,
                attack: 3,
                speed: 0.05,
            },

            isBoss: false,

            discovered: true,
        }, {
            id: 'drone',
            name: 'Drone',
            icon: ENEMY_ICON_PATH + "drone_32x32.png",

            description: 'Bien que peux dangereux, ce crabe est rarement seul et est très rapide.',
            tips: 'Débarassez vous en priorité mais ne paniquez pas car il fait peu de dégat.',

            score: 5,
            stats: {
                hp: 1,
                attack: 0.5,
                speed: 0.11,
            },

            isBoss: false,

            discovered: true,
        }, {
            id: 'papa',
            name: 'Papa',
            icon: ENEMY_ICON_PATH + "dad_crab.png", // 200x200

            description: 'Crabe massif est extrémement dangereux.',
            tips: 'Bien qu\'il soit suffisament dangereux pour vous vaincre en un coup, il est extrèmement lent. Le vrai danger est son endurance ainsi que les crabes l\'accompagnant.',

            score: 200,
            stats: {
                hp: 20,
                attack: 10,
                speed: 0.025,
            },

            isBoss: true,

            discovered: false,
        },
    ];

    public selectedMonster: string | null = null;

    // Statistiques calculées
    public get totalDiscovered(): number {
        return this.monsters.filter(m => m.discovered).length;
    }

    public get totalMonsters(): number {
        return this.monsters.length;
    }

    public get totalBosses(): number {
        return this.monsters.filter(m => m.isBoss).length;
    }

    public get bossMonsters(): Monster[] {
        return this.monsters.filter(m => m.isBoss);
    }

    constructor(
        private userService: UserService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.route.queryParams.subscribe(params => {
                this.selectedMonster = params['monster'] || null;
            })
        );

        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => {
                this.user = user;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getMonsterById(id: string): Monster | undefined {
        return this.monsters.find(m => m.id === id);
    }

    public getMonsterName(monsterId: string): string {
        const monster = this.getMonsterById(monsterId);
        return monster ? `${monster.icon} ${monster.name}` : 'Créature Inconnue';
    }

    public getCurrentMonster(): Monster | undefined {
        if (!this.selectedMonster) return undefined;
        return this.getMonsterById(this.selectedMonster);
    }
}