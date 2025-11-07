import { Animal } from './animal';
import { TileType } from './tile-type';

export class TileModel {

  public constructor(
    private _type: TileType,
    private _x: number,
    private _y: number,
    private _animal: Animal | null = null,
  ) {}

  public get type(): TileType {
    return this._type;
  }

  public get animal(): Animal | null {
    return this._animal;
  }

  public set animal(animal: Animal | null) {
    this._animal = animal;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }
}
