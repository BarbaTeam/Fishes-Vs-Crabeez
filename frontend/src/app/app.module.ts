// TODO : Reuniting components in modules

////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


////////////////////////////////////////////////////////////////////////////////
// Pages Components :

import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

import { ErgoPlayPageComponent } from './pages/ergo/play-page/ergo-play-page.component';
import { ErgoListPageComponent } from './pages/ergo/list-page/ergo-list-page.component';
import { ErgoLobbyGameComponent } from './pages/ergo/lobby-game/ergo-lobby-game.component';
import { ErgoConfigFormComponent } from './pages/ergo/ergo-config-form/ergo-config-form.component';
import { ErgoConfigSelectedPageComponent} from './pages/ergo/config-selected-page/ergo-config-selected-page.component';
import { ErgoStatSelectedPageComponent } from './pages/ergo/stat-selected-page/ergo-stat-selected-page.component';

import { ChildListPageComponent } from './pages/child/list-page/child-list-page.component';
import { ChildPlayPageComponent } from './pages/child/play-page/child-play-page.component';
import { ChildConfigPageComponent } from './pages/child/config-page/child-config-page.component';
import { ChildStatPageComponent } from './pages/child/stat-page/child-stat-page.component';
import { ChildLobbyGameComponent } from './pages/child/lobby-game/child-lobby-game.component';
import { GameComponent } from './pages/child/game/game.component';
import { UserConfigComponent } from './shared/components/user-config/user-config.component';


////////////////////////////////////////////////////////////////////////////////
// Shared Components :

import { TemplateComponent } from './shared/components/template/template.component';

// Boxes :
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { InnerBoxComponent } from './shared/components/inner-box/inner-box.component';
import { SideBoxComponent } from './shared/components/side-box/side-box.component';
import { RollableBoxComponent } from './shared/components/rollable-box/rollable-box.component';
import { MistakesBoxesComponent } from './shared/components/mistakes-box/mistakes-boxes.component';

// Users :
import { UserCardComponent } from './shared/components/user-card/user-card.component';
import { UserListComponent } from './shared/components/user-list/user-list.component';

// Inputs :
import { BigButtonComponent } from './shared/components/big-button/big-button.component';
import { MediumButtonComponent } from './shared/components/medium-button/medium-button.component';
import { SmallButtonComponent } from './shared/components/small-button/small-button.component';

// Setting :
import { SettingsSliderComponent } from './shared/components/settings-slider/settings-slider.component';
import { SettingsToggleComponent } from './shared/components/settings-toggle/settings-toggle.component';

// Miscellaneous :
import { GradingLineComponent } from './shared/components/grading-line/grading-line.component';
import { FormsModule } from '@angular/forms';



////////////////////////////////////////////////////////////////////////////////
// AppModule :
////////////////////////////////////////////////////////////////////////////////

@NgModule({
    declarations: [
        AppComponent,


        ////////////////////////////////////////////////////////////////////////
        // Pages Component :

        WelcomePageComponent,

        ErgoPlayPageComponent,
        ErgoListPageComponent,
        ErgoLobbyGameComponent,
        ErgoConfigFormComponent,
        ErgoConfigSelectedPageComponent,
        ErgoStatSelectedPageComponent,

        ChildListPageComponent,
        ChildPlayPageComponent,
        ChildConfigPageComponent,
        ChildStatPageComponent,
        ChildLobbyGameComponent,

        GameComponent,

        UserConfigComponent,


        ////////////////////////////////////////////////////////////////////////
        // Shared Component :

        TemplateComponent,
        // Boxes :
        NavbarComponent,
        MediumButtonComponent,
        InnerBoxComponent,
        SideBoxComponent,
        RollableBoxComponent,
        MistakesBoxesComponent,
        // Users :
        UserCardComponent,
        UserListComponent,
        // Setting :
        BigButtonComponent,
        SmallButtonComponent,
        SettingsSliderComponent,
        SettingsToggleComponent,
        // Miscellaneous :
        GradingLineComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
