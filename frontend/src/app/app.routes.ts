import { Routes } from '@angular/router';
import { StartMenu } from './components/start-menu/start-menu';
import { GameView } from './components/game-view/game-view';

export const routes: Routes = [
  { path: 'menu', component: StartMenu },
  { path: 'game', component: GameView },
  { path: '', redirectTo: '/menu', pathMatch: 'full' }
];
