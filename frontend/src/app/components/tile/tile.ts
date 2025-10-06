import { Component, computed, input } from '@angular/core';
import { TileType } from '../../models/tile-type';
import { TileModel } from '../../models/tile-model';

const SVG_PATHS = {
  [TileType.PLAIN]: 'plain.svg',
  [TileType.FOREST]: 'tree.svg',
  [TileType.LAC]: 'water.svg',
}

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.css'
})
export class Tile {
  public tile = input.required<TileModel>();

  protected svgPath = computed(() => SVG_PATHS[this.tile().type]);
}
