////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Modules :

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ErgoRoutingModule } from './ergo-routing.module';


////////////////////////////////////////////////////////////////////////////////
// Host :

import { ErgoHostComponent } from './ergo-host.component';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { GamesManagerPageComponent } from './pages/games-manager-page/games-manager-page.component';
import { GameLobbyPageComponent } from './pages/game-lobby-page/game-lobby-page.component';
import { ChildsListPageComponent } from './pages/childs-list-page/childs-list-page.component';
import { NewChildPageComponent } from './pages/new-child-page/new-child-page.component';
import { ChildStatsPageComponent } from './pages/child-stats-page/child-stats-page.component';
import { ChildConfigPageComponent } from './pages/child-config-page/child-config-page.component';



////////////////////////////////////////////////////////////////////////////////
// ErgoModule :
////////////////////////////////////////////////////////////////////////////////

const PAGES_COMPONENTS = [
    GamesManagerPageComponent,
    GameLobbyPageComponent,
    ChildsListPageComponent,
    NewChildPageComponent,
    ChildStatsPageComponent,
    ChildConfigPageComponent,
];



@NgModule({
    declarations: [
        ErgoHostComponent,
        ...PAGES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        ErgoRoutingModule,
        SharedModule,
    ],
    exports: [
        ErgoHostComponent,
        ...PAGES_COMPONENTS,
    ],
})
export class ErgoModule {}
