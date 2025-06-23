////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { SharedModule } from '@app/shared/shared.module';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { ChoicePageComponent } from './pages/choice-page/choice-page.component';
import { ChildsListPageComponent } from '../home/pages/childs-list-page/childs-list-page.component';



////////////////////////////////////////////////////////////////////////////////
// HomeModule :
////////////////////////////////////////////////////////////////////////////////

const PAGES_COMPONENTS = [
    ChoicePageComponent,
    ChildsListPageComponent,
];


@NgModule({
    declarations: [
        ...PAGES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
    ],
    exports: [
        ...PAGES_COMPONENTS,
    ],
})
export class HomeModule {}
