import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { ChildListPageComponent } from './pages/child/list-page/child-list-page.component';
import { ErgoPlayPageComponent } from './pages/ergo/play-page/ergo-play-page.component';
import { ErgoListPageComponent } from './pages/ergo/list-page/ergo-list-page.component';
import { ChildPlayPageComponent } from './pages/child/play-page/child-play-page.component';
import { ChildConfigPageComponent } from './pages/child/config-page/child-config-page.component';
import { ChildStatPageComponent } from './pages/child/stat-page/child-stat-page.component';
import { ChildLobbyGameComponent } from './pages/child/lobby-game/child-lobby-game.component';
import { ErgoLobbyGameComponent } from './pages/ergo/lobby-game/ergo-lobby-game.component';
import { ErgoConfigSelectedPageComponent } from './pages/ergo/config-selected-page/ergo-config-selected-page.component';
import { ErgoStatSelectedPageComponent } from './pages/ergo/stat-selected-page/ergo-stat-selected-page.component';
import { GameComponent } from './pages/child/game/game.component';

const routes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "child-list", component: ChildListPageComponent },
  { path: "ergo-play", component: ErgoPlayPageComponent },
  { path: "ergo-list", component: ErgoListPageComponent },
  { path: "child-play", component: ChildPlayPageComponent },
  { path: "child-config", component: ChildConfigPageComponent },
  { path: "child-stats", component: ChildStatPageComponent },
  { path: "child-lobby", component: ChildLobbyGameComponent },
  { path: "ergo-lobby", component: ErgoLobbyGameComponent },
  { path: "ergo-config-selected", component: ErgoConfigSelectedPageComponent },
  { path: "ergo-stat-selected", component: ErgoStatSelectedPageComponent },
  { path: "game", component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
