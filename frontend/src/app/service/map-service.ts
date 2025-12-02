import { inject, Injectable, Signal, signal } from '@angular/core';
import { MapModel } from '../models/map-model';
import { RestService } from './rest-service';
import { TileModel } from '../models/tile-model';
import { getRandomTileType } from '../models/tile-type';

export const MAP_SIZE: number = 8;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly _currentMap = signal<MapModel>(this.generateNewMap());
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
}
