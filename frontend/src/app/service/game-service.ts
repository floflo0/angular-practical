import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { MAP_SIZE, MapService } from './map-service';
import { Animal } from '../models/animal';
import { TileModel } from '../models/tile-model';
import { TileType } from '../models/tile-type';
import { OverlayService } from './overlay-service';
import { EndGamePopup } from '../components/end-game-popup/end-game-popup';

type ScoreRule = {
  points: number,
  radius: number;
  tiles: Record<TileType, number>,
  animals: Record<Animal, number>,
};

/**
 * Object containing the rules to compute the score.
 */
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

/**
 * Service that handle the state of the game.
 */
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private mapService: MapService = inject(MapService);
  private overlayService: OverlayService = inject(OverlayService);

  readonly MIN_PLAYER_NAME_LENGTH = 3;
  readonly MAX_PLAYER_NAME_LENGTH = 16;

  /**
   * The name of the player.
   */
  private readonly _playerName = signal<string>('');
  /**
   * Read only view of _playerName.
   */
  public readonly playerName: Signal<string> = this._playerName.asReadonly();

  /**
   * The id of the turn of the current game.
   */
  private readonly _turn = signal<number>(0);
  /**
   * Read only view of _turn.
   */
  public readonly turn: Signal<number> = this._turn.asReadonly();

  /**
   * The score of the current game.
   */
  private readonly _score = signal<number>(0);
  /**
   * Read only view of _score.
   */
  public readonly score: Signal<number> = this._score.asReadonly();

  /**
   * The score to reach in order to go to the next turn.
   */
  private readonly _scoreLimit = signal<number>(0);
  /**
   * Read only view of _scoreLimit.
   */
  public readonly scoreLimit: Signal<number> = this._scoreLimit.asReadonly();

  /**
   * The animal selected by the player, null if no animal is selected.
   */
  private readonly _selectedAnimal = signal<Animal | null>(null);
  /**
   * Read only view of _selectedAnimal.
   */
  public readonly selectedAnimal: Signal<Animal | null> = this._selectedAnimal.asReadonly();

  private readonly _hoveredTile = signal<TileModel | null>(null);
  /**
   * Read only view of _hoveredTile.
   */
  public readonly hoveredTile: Signal<TileModel | null> = this._hoveredTile.asReadonly();

  /**
   * The current inventory of the player. For each animal, it contains the number
   * of animal available to place.
   */
  private readonly _inventory  = signal<Record<Animal, number>>({
    [Animal.BEAR]: 0,
    [Animal.FISH]: 0,
    [Animal.FOX]: 0,
  });
  /**
   * Read only view of _inventory.
   */
  public readonly inventory = this._inventory.asReadonly();

  /**
   * Create a new game and reset the game state.
   *
   * @param playerName The name of the player for the new game.
   * @param map The map to use in the new game.
   */
  public createGame(playerName: string, map: MapModel): void {
    this._playerName.set(playerName);
    this.mapService.setCurrentMap(map);
    this._turn.set(1);
    this._score.set(0);
    this._scoreLimit.set(8);
    this._selectedAnimal.set(null);
    this._inventory.set({
      [Animal.BEAR]: 1,
      [Animal.FISH]: 0,
      [Animal.FOX]: 0,
    });
  }

  /**
   * Change the animal selected by the player.
   *
   * @param animal The new selected animal, null if no animal is selected.
   */
  public selectAnimal(animal: Animal | null): void {
    if (animal !== null && this._inventory()[animal] == 0) return;

    this._selectedAnimal.set(animal);
  }

  public setHoveredTile(tile: TileModel | null): void {
    this._hoveredTile.set(tile);
  }

  public getScoreContributions(tile: TileModel, animal: Animal): Map<TileModel, number> {
    const { points, radius, tiles, animals } = SCORE_RULES[animal];
    const contributions = new Map<TileModel, number>();

    if (points !== 0) {
      contributions.set(tile, points);
    }

    const yMin = Math.max(tile.y - radius, 0);
    const yMax = Math.min(tile.y + radius, MAP_SIZE - 1);
    const xMin = Math.max(tile.x - radius, 0);
    const xMax = Math.min(tile.x + radius, MAP_SIZE - 1);
    const mapTiles = this.mapService.currentMap().tiles;

    for (let y = yMin; y <= yMax; ++y) {
      for (let x = xMin; x <= xMax; ++x) {
        if (x === tile.x && y === tile.y) continue;
        const currentTile = mapTiles[y][x];
        let score = 0;

        Object.keys(tiles).forEach(key => {
          const tileType = Number(key) as TileType;
          if (currentTile.animal === null && currentTile.type === tileType) {
            score += tiles[tileType];
          }
        });

        Object.keys(animals).forEach(key => {
          const animalType = Number(key) as Animal;
          if (currentTile.animal === animalType) {
            score += animals[animalType];
          }
        });

        if (score !== 0) {
          contributions.set(currentTile, score);
        }
      }
    }

    return contributions;
  }

  /**
    * Return the number of points given by the animal when placed on the tile.
    *
    * @param tile The tile where the animal will be placed.
    * @param animal The animal to place.
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

  /**
   * Return true if the player can place the selected animal on the tile.
   *
   * @param tile The tile to check.
   *
   * @returns true if the animal can be placed.
   */
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

  /**
   * Place the selected animal on the tile.
   *
   * @param tile The tile to place the animal on.
   */
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

  /**
   * Restore the game state to a previous state.
   *
   * @param turn The turn to go back to.
   * @param score The score to go back to.
   * @param scoreLimit The score limit to go back to.
   * @param inventory The inventory to go back to.
   * @param map The map state to go back to.
   */
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

  /**
   * Check if the end of the game is triggered.
   *
   * The game can be finished if
   * - The inventory is empty.
   * - The player can't place his remaining animals.
   * - All tiles contains animals.
   *
   * @returns true if the game is finished.
   */
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

  /**
   * If the score limit is reach, increment the turn id, compute the new
   * score limit and give the player new animals to place.
   */
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
    console.log('terminateGame');
    this.overlayService.open(EndGamePopup, false);
  }

  /**
   * Update the player name.
   *
   * @param playerName The new player name.
   */
  public setPlayerName(playerName: string): void {
    this._playerName.set(playerName);
  }

  /**
   * Generate a random name for the player and returns it.
   *
   * @returns the generated name.
   */
  public generateNewName(): string {
    this._playerName.set('Player-' + Math.random().toString(36).substring(2, 9));
    return this.playerName();
  }
}
