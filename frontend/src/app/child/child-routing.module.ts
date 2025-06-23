////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { JoiningGamesPageComponent } from './pages/joining-games-page/joining-games-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { GamesListPageComponent } from './pages/games-list-page/games-list-page.component';
import { GameComponent } from './pages/game/game.component';



////////////////////////////////////////////////////////////////////////////////
// ChildRoutingModule :
////////////////////////////////////////////////////////////////////////////////

const ROUTES: Routes = [
    { path: "", redirectTo: "joining-games", pathMatch: "full" },

    { path: "settings", component: SettingsPageComponent },

    // TODO : Fuse "joining-games" & "games-list"
    { path: "joining-games", component: JoiningGamesPageComponent },
    { path: "games-list", component: GamesListPageComponent },

    { path: "profile", component: ProfilePageComponent },

    { path: "game", component: GameComponent},
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ChildRoutingModule {}
