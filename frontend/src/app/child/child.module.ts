////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Modules :

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ChildRoutingModule } from './child-routing.module';


////////////////////////////////////////////////////////////////////////////////
// Host :

import { ChildHostComponent } from './child-host.component';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { BestiaryPageComponent } from './pages/bestiary-page/bestiary-page.component';
import { GamesListPageComponent } from './pages/games-list-page/games-list-page.component';


////////////////////////////////////////////////////////////////////////////////
// ChildModule :
////////////////////////////////////////////////////////////////////////////////

const PAGES_COMPONENTS = [
    ProfilePageComponent,
    BestiaryPageComponent,
    GamesListPageComponent,
];



@NgModule({
    declarations: [
        ChildHostComponent,
        ...PAGES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        ChildRoutingModule,
        SharedModule,
    ],
    exports: [
        ChildHostComponent,
        ...PAGES_COMPONENTS,
    ],
})
export class ChildModule {}
