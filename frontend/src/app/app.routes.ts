import { Routes } from '@angular/router';
import { StartMenu } from './components/start-menu/start-menu';
import { GameView } from './components/game-view/game-view';

export const routes: Routes = [
  { path: 'menu', component: StartMenu },
  { path: 'game/:name', component: GameView },
  { path: 'game', redirectTo: '/menu' },
  { path: '', redirectTo: '/menu', pathMatch: 'full' }
];
