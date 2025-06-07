////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameHostComponent } from './game-host.component';
import { gameDeactivateGuard } from './guards/game-deactivate.guard';

////////////////////////////////////////////////////////////////////////////////
// Pages :

import { GameWaitingPageComponent } from './pages/waiting-page/game-waiting-page.component';
import { GameRunningPageComponent } from './pages/running-page/game-running-page.component';



////////////////////////////////////////////////////////////////////////////////
// ChildRoutingModule :
////////////////////////////////////////////////////////////////////////////////

export const ROUTES: Routes = [
    {
        path: '',
        component: GameHostComponent,
        canDeactivate: [gameDeactivateGuard],
        children: [
            { path: '', redirectTo: 'waiting', pathMatch: 'full' },

            { path: 'waiting', component: GameWaitingPageComponent },
            { path: 'running', component: GameRunningPageComponent },
        ],
    },
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class GameRoutingModule {}
