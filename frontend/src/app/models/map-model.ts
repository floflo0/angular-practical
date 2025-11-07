import { TileModel } from './tile-model';

export class MapModel {

  public constructor(
    private _name: string,
    private _tiles: TileModel[][],
  ) {}

  public get name() {
    return this._name;
  }

  public get tiles() {
    return this._tiles;
  }
}
