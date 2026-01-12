import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { RestService } from './rest-service';
import { TileModel } from '../models/tile-model';
import { getRandomTileType, TileType } from '../models/tile-type';
import { Animal } from '../models/animal';

export const MAP_SIZE: number = 8;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly _currentMap = signal<MapModel>(new MapModel('', []));
  public readonly currentMap: Signal<MapModel> = this._currentMap.asReadonly();

  private readonly restService: RestService = inject(RestService);

  public setCurrentMap(map: MapModel): void {
    this._currentMap.set(map);
  }

  public getMapNames(): Promise<string[]> {
    return this.restService.getMapNames();
  }

  public generateNewMap(): MapModel {
    const tiles: TileModel[][] = [];
    for (let y = 0; y < MAP_SIZE; ++y) {
      const line: TileModel[] = [];
      for (let x = 0; x < MAP_SIZE; ++x) {
        line.push(new TileModel(getRandomTileType(), x, y))
      }
      tiles.push(line);
    }
    return new MapModel('', tiles);
  }

  public async saveMap(map: MapModel): Promise<void> {
    await this.restService.saveMap(map);
  }

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
