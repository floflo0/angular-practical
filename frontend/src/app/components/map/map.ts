import { Component, HostBinding } from '@angular/core';
import { Tile } from '../tile/tile';
import { MapModel } from '../../models/map-model';

@Component({
  selector: 'app-map',
  imports: [Tile],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {
  protected readonly map: MapModel;

  public constructor() {
    this.map = new MapModel();
  }

  @HostBinding('style.--map-size')
  protected get mapSize() { return this.map.tiles.length; }
}
