import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { RestService } from './rest-service';
import { TileModel } from '../models/tile-model';
import { getRandomTileType, TileType } from '../models/tile-type';
import { Animal } from '../models/animal';

/**
 * Number of tiles in the map per side.
 */
export const MAP_SIZE: number = 8;

/**
 * Service that handle the maps of the game.
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly restService: RestService = inject(RestService);

  /**
   * The map used by the current game.
   */
  private readonly _currentMap = signal<MapModel>(new MapModel('', []));
  /**
   * Read only view of _currentMap.
   */
  public readonly currentMap: Signal<MapModel> = this._currentMap.asReadonly();

  /**
   * Change the current map.
   */
  public setCurrentMap(map: MapModel): void {
    this._currentMap.set(map);
  }

  /**
   * Returns all the map names from the backend.
   *
   * @returns a list of map names.
   */
  public getMapNames(): Promise<string[]> {
    return this.restService.getMapNames();
  }

  /**
   * Returns the map with the corresponding name.
   *
   * @param mapName The name of the map to get.
   * @returns the map.
   */
  public async getMap(mapName: string): Promise<MapModel> {
    return await this.restService.getMap(mapName);
  }

  /**
   * Generate a new random map.
   *
   * @returns the generated map.
   */
  public generateNewMap(): MapModel {
    const tiles: TileModel[][] = [];
    for (let y = 0; y < MAP_SIZE; ++y) {
      const line: TileModel[] = [];
      for (let x = 0; x < MAP_SIZE; ++x) {
        line.push(new TileModel(getRandomTileType(), x, y))
      }
      tiles.push(line);
    }
    const randomName = 'Map-' + Math.random().toString(36).substring(2, 9);
    return new MapModel(randomName, tiles);
  }

  /**
   * Save a map to the backend.
   */
  public async saveMap(map: MapModel): Promise<void> {
    await this.restService.saveMap(map);
  }

  /**
   * Iterates over all tiles within a square radius around a given tile,
   * excluding the tile itself, and applies a callback to each.
   *
   * @param tile The central tile to iterate around.
   * @param radius The radius in tiles to include around the central tile.
   * @param callback the callback to execute for each tile.
   */
  private iterateRadius(
    tile: TileModel,
    radius: number,
    callback: (tile: TileModel) => void,
  ) {
    const yMin = Math.max(tile.y - radius, 0);
    const yMax = Math.min(tile.y + radius, MAP_SIZE - 1);
    const xMin = Math.max(tile.x - radius, 0);
    const xMax = Math.min(tile.x + radius, MAP_SIZE - 1);
    const { tiles } = this.currentMap();
    for (let y = yMin; y <= yMax; ++y) {
      const line = tiles[y];
      for (let x = xMin; x <= xMax; ++x) {
        if (x === tile.x && y === tile.y) continue;
        callback(line[x]);
      }
    }
  }

  /**
   * Compute the number of tile of a certain type around in the square radius
   * around a given tile.
   *
   * @param tile The central tile to count around.
   * @param radius The radius in tiles.
   * @param type The type of tile to count.
   * @returns the number of tile of the type.
   */
  public getNumberTileTypeAroundTile(
    tile: TileModel,
    radius: number,
    type: TileType,
  ): number {
    let count = 0;
    this.iterateRadius(tile, radius, tile => {
      if (tile.animal === null && tile.type === type) ++count;
    });
    return count;
  }

  /**
   * Compute the number of tiles containing a certain animal in the square
   * radius around a given tile.
   *
   * @param tile The central tile to count around.
   * @param radius The radius in tiles.
   * @param animal The animal to count.
   * @returns the number of times the animal was found.
   */
  public getNumberAnimalAroundTile(
    tile: TileModel,
    radius: number,
    animal: Animal,
  ): number {
    let count = 0;
    this.iterateRadius(tile, radius, tile => {
      if (tile.animal === animal) ++count;
    });
    return count;
  }
}
