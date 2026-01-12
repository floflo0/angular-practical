import { Component, inject, OnInit } from '@angular/core';
import { Map } from '../map/map';
import { InventorySelector } from '../inventory-selector/inventory-selector';
import { SelectedAnimal } from '../selected-animal/selected-animal';
import { Score } from '../score/score';
import {UndoRedo} from '../undo-redo/undo-redo';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../service/rest-service';
import { GameService } from '../../service/game-service';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [Map, InventorySelector, SelectedAnimal, Score, UndoRedo],
  templateUrl: './game-view.html',
  styleUrls: ['./game-view.css']
})
export class GameView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly restService = inject(RestService);
  private readonly gameService = inject(GameService);

  async ngOnInit() {
    const mapName = this.route.snapshot.paramMap.get('name');
    if (mapName) {
      try {
        const map = await this.restService.getMap(mapName);
        const currentPlayerName = this.gameService.playerName() || 'Anonymous Player';
        this.gameService.createGame(currentPlayerName, map);
      } catch (error) {
        console.error('Failed to load map:', mapName, error);
        await this.router.navigate(['/menu']);
      }
    } else {
      await this.router.navigate(['/menu']);
    }
  }
}
