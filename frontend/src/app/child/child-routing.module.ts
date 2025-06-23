////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChildHostComponent } from './child-host.component';
import { childDeactivateGuard } from './guards/child-deactivate.guard';

////////////////////////////////////////////////////////////////////////////////
// Pages :

import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { GamesListPageComponent } from './pages/games-list-page/games-list-page.component';
import { GameLobbyPageComponent } from './pages/game-lobby-page/game-lobby-page.component';
import { GameComponent } from './pages/game/game.component';



////////////////////////////////////////////////////////////////////////////////
// ChildRoutingModule :
////////////////////////////////////////////////////////////////////////////////

export const ROUTES: Routes = [
    {
        path: '',
        component: ChildHostComponent,
        canDeactivate: [childDeactivateGuard],
        children: [
            { path: '', redirectTo: 'games-list', pathMatch: 'full' },

            { path: 'profile', component: ProfilePageComponent },
            { path: 'settings', component: SettingsPageComponent },

            { path: 'games-list', component: GamesListPageComponent },
            { path: 'game-lobby', component: GameLobbyPageComponent },
            { path: 'game', component: GameComponent },
        ],
    },
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ChildRoutingModule {}
