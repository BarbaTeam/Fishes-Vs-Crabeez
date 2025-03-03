import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateComponent } from './shared/components/template/template.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { BigButtonComponent } from './shared/components/big-button/big-button.component';
import { MediumButtonComponent } from './shared/components/medium-button/medium-button.component';
import { InnerBoxComponent } from './shared/components/inner-box/inner-box.component';
import { SmallButtonComponent } from './shared/components/small-button/small-button.component';
import { UserCardComponent } from './shared/components/user-card/user-card.component';
import { SettingsSliderComponent } from './shared/components/settings-slider/settings-slider.component';
import { SettingsToggleComponent } from './shared/components/settings-toggle/settings-toggle.component';

import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { ChildListPageComponent } from './pages/child/list-page/child-list-page.component';
import { ErgoPlayPageComponent } from './pages/ergo/play-page/ergo-play-page.component';
import { ErgoConfigPageComponent } from './pages/ergo/config-page/ergo-config-page.component';
import { ErgoStatPageComponent } from './pages/ergo/stat-page/ergo-stat-page.component';
import { ChildPlayPageComponent } from './pages/child/play-page/child-play-page.component';
import { ChildConfigPageComponent } from './pages/child/config-page/child-config-page.component';
import { ChildStatPageComponent } from './pages/child/stat-page/child-stat-page.component';
import { ChildLobbyGameComponent } from './pages/child/lobby-game/child-lobby-game.component';
import { ErgoLobbyGameComponent } from './pages/ergo/lobby-game/ergo-lobby-game.component';
import { ErgoConfigSelectedPageComponent} from './pages/ergo/config-selected-page/ergo-config-selected-page.component';
import { ErgoStatSelectedPageComponent } from './pages/ergo/stat-selected-page/ergo-stat-selected-page.component';


@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    WelcomePageComponent,
    ChildListPageComponent,
    NavbarComponent,
    BigButtonComponent,
    MediumButtonComponent,
    SmallButtonComponent,
    InnerBoxComponent,
    ErgoPlayPageComponent,
    ErgoConfigPageComponent,
    ErgoStatPageComponent,
    ChildPlayPageComponent,
    ChildConfigPageComponent,
    ChildStatPageComponent,
    ChildLobbyGameComponent,
    ErgoLobbyGameComponent,
    UserCardComponent,
    ErgoConfigSelectedPageComponent,
    ErgoStatSelectedPageComponent,
    SettingsSliderComponent,
    SettingsToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
