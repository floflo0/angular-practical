import { TileType } from './tile-type';

export class TileModel {
  public constructor(
    private _type: TileType,
    private _x: number,
    private _y: number,
  ) {}

  public get type() {
    return this._type;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }
}
