import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { MapService } from './map-service';
import { Animal } from '../models/animal';
import { TileModel } from '../models/tile-model';
import { TileType } from '../models/tile-type';

type ScoreRule = {
  points: number,
  radius: number;
  tiles: Record<TileType, number>,
  animals: Record<Animal, number>,
};

const SCORE_RULES: Record<Animal, ScoreRule> = {
  [Animal.BEAR]: {
    points: 6,
    radius: 2,
    tiles: {
      [TileType.PLAIN]: 0,
      [TileType.TREE]: 4,
      [TileType.WATER]: 0,
    },
    animals: {
      [Animal.BEAR]: -5,
      [Animal.FISH]: 7,
      [Animal.FOX]: -2,
    },
  },
  [Animal.FISH]: {
    points: 8,
    radius: 1,
    tiles: {
      [TileType.PLAIN]: 0,
      [TileType.TREE]: 0,
      [TileType.WATER]: 5,
    },
    animals: {
      [Animal.BEAR]: 0,
      [Animal.FISH]: -2,
      [Animal.FOX]: 0,
    },
  },
  [Animal.FOX]: {
    points: 5,
    radius: 1,
    tiles: {
      [TileType.PLAIN]: 7,
      [TileType.TREE]: 0,
      [TileType.WATER]: 0,
    },
    animals: {
      [Animal.BEAR]: 0,
      [Animal.FISH]: 0,
      [Animal.FOX]: -2,
    },
  },
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private mapService: MapService = inject(MapService);

  private readonly _playerName = signal<string>('');
  public readonly playerName: Signal<string> = this._playerName.asReadonly();

  private readonly _turn = signal<number>(0);
  public readonly turn: Signal<number> = this._turn.asReadonly();

  private readonly _score = signal<number>(0);
  public readonly score: Signal<number> = this._score.asReadonly();

  private readonly _scoreLimit = signal<number>(0);
  public readonly scoreLimit: Signal<number> = this._scoreLimit.asReadonly();

  private readonly _selectedAnimal = signal<Animal | null>(null);
  public readonly selectedAnimal: Signal<Animal | null> = this._selectedAnimal.asReadonly();

  private readonly _inventory  = signal<Record<Animal, number>>({
    [Animal.BEAR]: 0,
    [Animal.FISH]: 0,
    [Animal.FOX]: 0,
  });
  public readonly inventory = this._inventory.asReadonly();

  public createGame(playerName: string, map: MapModel): void {
    this._playerName.set(playerName);
    this.mapService.setCurrentMap(map);
    this.nextTurn()
  }

  public selectAnimal(animal: Animal | null): void {
    if (animal !== null && this._inventory()[animal] == 0) return;

    this._selectedAnimal.set(animal);
  }

  /**
    * Return the number of points given by the animal when placed on the tile.
    *
    * @param tile - The tile where the animal will be placed.
    * @param animal - The animal to place.
    *
    * @returns the number of points.
    */
  private computeScore(tile: TileModel, animal: Animal): number {
    const { points, radius, tiles, animals } = SCORE_RULES[animal];

    let score = points;

    Object.keys(tiles).forEach(key => {
      const tileType = Number(key) as TileType;
      score += this.mapService.getNumberTileTypeAroundTile(
        tile,
        radius,
        tileType,
      ) * tiles[tileType];
    });

    Object.keys(animals).forEach(key => {
      const animal = Number(key) as Animal;
      score += this.mapService.getNumberAnimalAroundTile(
        tile,
        radius,
        animal,
      ) * animals[animal];
    });

    return Math.max(score, 0);
  }

  public canPlaceSelectedAnimal(tile: TileModel): boolean {
    if (tile.animal !== null) return false;

    const selectedAnimal = this._selectedAnimal();
    switch (selectedAnimal) {
      case null: return false;

      case Animal.BEAR:
        if (tile.type === TileType.WATER) return false;
        break

      case Animal.FISH:
        if (tile.type !== TileType.WATER) return false;
        break;

      case Animal.FOX:
        if (tile.type === TileType.WATER) return false;
        break

      default:
        console.assert(false, 'unreachable');
    }

    return true;
  }

  public placeSelectedAnimal(tile: TileModel): void {
    console.assert(this.canPlaceSelectedAnimal(tile));

    if (tile.animal !== null) return;

    const selectedAnimal = this._selectedAnimal();
    switch (selectedAnimal) {
      case null: return;

      case Animal.BEAR:
        if (tile.type === TileType.WATER) return;
        break

      case Animal.FISH:
        if (tile.type !== TileType.WATER) return;
        break;

      case Animal.FOX:
        if (tile.type === TileType.WATER) return;
        break

      default:
        console.assert(false, 'unreachable');
    }

    this._score.update(
      score => score + this.computeScore(tile, selectedAnimal),
    );
    this.nextTurn();

    this.mapService.currentMap().tiles[tile.y][tile.x] = new TileModel(
      tile.type,
      tile.x,
      tile.y,
      selectedAnimal,
    );
    this._inventory.update(inventory => ({
      ...inventory,
      [selectedAnimal]: inventory[selectedAnimal] - 1,
    }));

    if (this.inventory()[selectedAnimal] === 0) {
      this._selectedAnimal.set(null);
    }

    if (this.checkGameEnd()) {
      this.terminateGame();
    }
  }

  public restoreState(
    turn: number,
    score: number,
    scoreLimit: number,
    inventory: Record<Animal, number>,
    map: MapModel,
  ): void {
    this._turn.set(turn);
    this._score.set(score);
    this._scoreLimit.set(scoreLimit);
    this._inventory.set(inventory);
    this.mapService.setCurrentMap(map);
    const selectedAnimal = this.selectedAnimal();
    if (selectedAnimal !== null && this.inventory()[selectedAnimal] === 0) {
      this._selectedAnimal.set(null);
    }
  }

  private checkGameEnd(): boolean {
    const inventory = this._inventory();
    const bearCount = inventory[Animal.BEAR];
    const fishCount = inventory[Animal.FISH];
    const foxCount = inventory[Animal.FOX];
    if (bearCount === 0 && fishCount === 0 && foxCount === 0) return true;

    let groundTileEmpty = false;
    let waterTileEmpty = false;
    const { tiles } = this.mapService.currentMap();
    for (let y = 0; y < tiles.length; ++y) {
      for (let x = 0; x < tiles[y].length; ++x) {
        if (tiles[y][x].animal !== null) continue;

        if (tiles[y][x].type !== TileType.WATER) {
          groundTileEmpty = true;
          if (waterTileEmpty) break;
        } else {
          waterTileEmpty = true;
          if (groundTileEmpty) break;
        }
      }
    }

    return ((!groundTileEmpty && (!waterTileEmpty || fishCount === 0)) ||
            (!waterTileEmpty && bearCount === 0 && foxCount === 0));
  }

  private nextTurn(): void {
    if (this.score() < this.scoreLimit()) return;

    this._turn.update(turn => turn + 1);
    this._inventory.update(inventory => {
      ++inventory[Animal.BEAR];
      ++inventory[Animal.FISH];
      ++inventory[Animal.FOX];
      return inventory;
    });
    this._scoreLimit.update(scoreLimit => scoreLimit + 8 * this.turn())
    this.nextTurn();
  }

  // TODO: implement GameService.terminateGame
  public terminateGame(): void {
  }

  public setPlayerName(playerName: string): void {
    this._playerName.set(playerName);
  }
}
