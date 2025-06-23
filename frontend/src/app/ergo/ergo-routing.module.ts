////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { GamesManagerPageComponent } from './pages/games-manager-page/games-manager-page.component';
import { GameLobbyPageComponent } from './pages/game-lobby-page/game-lobby-page.component';
import { ChildsListPageComponent } from './pages/childs-list-page/childs-list-page.component';
import { NewChildPageComponent } from './pages/new-child-page/new-child-page.component';
import { ChildStatsPageComponent } from './pages/child-stats-page/child-stats-page.component';
import { ChildConfigPageComponent } from './pages/child-config-page/child-config-page.component';



////////////////////////////////////////////////////////////////////////////////
// ErgoRoutingModule :
////////////////////////////////////////////////////////////////////////////////

const ROUTES: Routes = [
    { path: "", redirectTo: "games-manager", pathMatch: "full" },

    { path: "games-manager", component: GamesManagerPageComponent },
    { path: "game-lobby", component: GameLobbyPageComponent },

    { path: "childs-list", component: ChildsListPageComponent },
    { path: "new-child", component: NewChildPageComponent },
    { path: "child-stats", component: ChildStatsPageComponent },
    { path: "child-config", component: ChildConfigPageComponent },
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ErgoRoutingModule {}
