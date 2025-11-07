import { Component, computed, HostBinding, inject, Signal } from '@angular/core';
import { Tile } from '../tile/tile';
import { MapModel } from '../../models/map-model';
import { MapService } from '../../service/map-service';

@Component({
  selector: 'app-map',
  imports: [Tile],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {
  private readonly mapService: MapService = inject(MapService);

  protected readonly map: Signal<MapModel> = this.mapService.currentMap;
  private readonly _mapSize: Signal<number> = computed(
    () => this.map().tiles.length,
  );

  @HostBinding('style.--map-size')
  protected get mapSize(): number {
    return this._mapSize();
  }
}
