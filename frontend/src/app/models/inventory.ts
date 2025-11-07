export class Inventory {
  private _bearCount: number = 0;
  private _fishCount: number = 0;
  private _foxCount: number = 0;

  public get bearCount(): number {
    return this._bearCount;
  }

  public get fishCount(): number {
    return this._fishCount;
  }

  public get foxCount(): number {
    return this._foxCount;
  }
}
