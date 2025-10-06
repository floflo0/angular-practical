import { TileModel } from './tile-model';

const MAP_SIZE: number = 10;

export class MapModel {
  private _tiles: TileModel[][];

  public constructor() {
    this._tiles = [];
    for (let y = 0; y < MAP_SIZE; ++y) {
      const line: TileModel[] = [];
      for (let x = 0; x < MAP_SIZE; ++x) {
        line.push(new TileModel(Math.floor(Math.random() * 3), x, y))
      }
      this._tiles.push(line);
    }
  }

  public get tiles() {
    return this._tiles;
  }
}
