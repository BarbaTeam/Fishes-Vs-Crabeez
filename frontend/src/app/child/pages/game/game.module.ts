////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Modules :

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { GameRoutingModule } from './game-routing.module';


////////////////////////////////////////////////////////////////////////////////
// Host :

import { GameHostComponent } from './game-host.component';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { GameWaitingPageComponent } from './pages/waiting-page/game-waiting-page.component';
import { GameRunningPageComponent } from './pages/running-page/game-running-page.component';



////////////////////////////////////////////////////////////////////////////////
// ChildModule :
////////////////////////////////////////////////////////////////////////////////

const PAGES_COMPONENTS = [
    GameWaitingPageComponent,
    GameRunningPageComponent,
];



@NgModule({
    declarations: [
        GameHostComponent,
        ...PAGES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        GameRoutingModule,
        SharedModule,
    ],
    exports: [
        GameHostComponent,
        ...PAGES_COMPONENTS,
    ],
})
export class GameModule {}
