import { Component, inject, OnInit } from '@angular/core';
import { Map } from '../map/map';
import { InventorySelector } from '../inventory-selector/inventory-selector';
import { SelectedAnimal } from '../selected-animal/selected-animal';
import { Score } from '../score/score';
import { UndoRedo } from '../undo-redo/undo-redo';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../service/game-service';
import { MapService } from '../../service/map-service';
import { NameInfo } from '../name-info/name-info';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [Map, InventorySelector, SelectedAnimal, Score, UndoRedo, NameInfo],
  templateUrl: './game-view.html',
  styleUrls: ['./game-view.css']
})
export class GameView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mapService = inject(MapService);
  private readonly gameService = inject(GameService);

  async ngOnInit() {
    const mapName = this.route.snapshot.paramMap.get('name');
    if (mapName) {
      try {
        const map = await this.mapService.getMap(mapName);
        const currentPlayerName = this.gameService.playerName() || this.gameService.generateNewName();
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
