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
import { BestiaryPageComponent } from './pages/bestiary-page/bestiary-page.component';
import { GamesListPageComponent } from './pages/games-list-page/games-list-page.component';



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
            { path: 'bestiary', component: BestiaryPageComponent },

            { path: 'games-list', component: GamesListPageComponent },

            // Game Subtree :
            {
                path: "game",
                loadChildren: () => import(
                    "@app/child/pages/game/game.module"
                ).then(
                    m => m.GameModule
                ),
            },
        ],
    },
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ChildRoutingModule {}
