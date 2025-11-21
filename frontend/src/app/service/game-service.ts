import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { MapService } from './map-service';
import { Animal } from '../models/animal';
import { TileModel } from '../models/tile-model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private mapService: MapService = inject(MapService);

  private readonly _playerName = signal<string>('');
  public readonly playerName: Signal<string> = this._playerName.asReadonly();

  private readonly _score = signal<number>(0);
  public readonly score: Signal<number> = this._score.asReadonly();

  private readonly _turnNumber = signal<number>(0);
  public readonly turnNumber: Signal<number> = this._turnNumber.asReadonly();

  private readonly _selectedAnimal = signal<Animal | null>(null);
  public readonly selectedAnimal: Signal<Animal | null> = this._selectedAnimal.asReadonly();

  private readonly _inventory  = signal<Record<Animal, number>>({
    [Animal.BEAR]: 0,
    [Animal.FISH]: 0,
    [Animal.FOX]: 0,
  });
  public readonly invetory = this._inventory.asReadonly();

  public createGame(playerName: string, map: MapModel): void {
    this._playerName.set(playerName);
    this.mapService.setCurrentMap(map);
  }

  public selectAnial(animal: Animal | null): void {
    if (animal !== null && this._inventory()[animal] == 0) return;

    this._selectedAnimal.set(animal);
  }

  public placeAnimal(tile: TileModel): void {
    tile.animal = this.selectedAnimal();
  }

  // TODO: implement GameService.terminateGame
  public terminateGame(): void {
  }

  public setPlayerName(playerName: string): void {
    this._playerName.set(playerName);
  }
}
