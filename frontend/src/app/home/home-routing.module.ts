////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeHostComponent } from './home-host.component';
import { homeActivateGuard } from './guards/home-activate.guard';
import { homeDeactivateGuard } from './guards/home-deactivate.guard';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { ChoicePageComponent } from './pages/choice-page/choice-page.component';
import { ChildsListPageComponent } from './pages/childs-list-page/childs-list-page.component';



////////////////////////////////////////////////////////////////////////////////
// HomeRoutingModule :
////////////////////////////////////////////////////////////////////////////////

export const ROUTES: Routes = [
    {
        path: '',
        component: HomeHostComponent,
        canActivate: [homeActivateGuard],
        canDeactivate: [homeDeactivateGuard],
        children: [
            { path: '', redirectTo: 'choice', pathMatch: 'full' },

            { path: 'choice', component: ChoicePageComponent },
            { path: 'childs-list', component: ChildsListPageComponent },
        ],
    },
];



@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
