import { Component, computed, inject, input } from '@angular/core';
import { TileType } from '../../models/tile-type';
import { TileModel } from '../../models/tile-model';
import { Animal } from '../../models/animal';
import { GameService } from '../../service/game-service';
import { PartialPointOrTouchTypedBinder } from 'interacto';
import { PlaceAnimalCommand } from '../../command/place-animal-command';
import { InteractoModule } from 'interacto-angular';
import { MapService } from '../../service/map-service';

const ANIMAL_SVG_PATHS = {
  [Animal.BEAR]: 'bear.svg',
  [Animal.FISH]: 'fish.svg',
  [Animal.FOX]: 'fox.svg',
}

const TILE_TYPE_SVG_PATHS = {
  [TileType.PLAIN]: 'plain.svg',
  [TileType.TREE]: 'tree.svg',
  [TileType.WATER]: 'water.svg',
}

const ANIMAL_ALT_MESSAGES = {
  [Animal.BEAR]: 'Case ours',
  [Animal.FISH]: 'Case poisson',
  [Animal.FOX]: 'Case renard',
};

const TILE_TYPE_ALT_MESSAGES = {
  [TileType.PLAIN]: 'Case plaine',
  [TileType.TREE]: 'Case forêt',
  [TileType.WATER]: 'Case lac',
}

@Component({
  selector: 'app-tile',
  imports: [InteractoModule],
  templateUrl: './tile.html',
  styleUrl: './tile.css'
})
export class Tile {
  public tile = input.required<TileModel>();

  private readonly gameService: GameService = inject(GameService);
  private readonly mapService: MapService = inject(MapService);

  protected setUpClickCommand(binder: PartialPointOrTouchTypedBinder): void {
    binder
      .toProduce(() => new PlaceAnimalCommand(
        this.gameService,
        this.mapService,
        this.tile(),
     ))
      .when(() => this.gameService.canPlaceSelectedAnimal(this.tile()))
      .bind();
  }

  protected handleClick() {
    this.gameService.placeSelectedAnimal(this.tile());
  }

  protected svgPath = computed(() => {
    const { animal, type } = this.tile();
    if (animal !== null) return ANIMAL_SVG_PATHS[animal];
    return TILE_TYPE_SVG_PATHS[type];
  });

  protected altMessage = computed(() => {
    const { animal, type } = this.tile();
    if (animal !== null) return ANIMAL_ALT_MESSAGES[animal];
    return TILE_TYPE_ALT_MESSAGES[type];
  });

  protected onMouseEnter(): void {
    this.gameService.setHoveredTile(this.tile());
  }

  protected onMouseLeave(): void {
    if (this.gameService.hoveredTile() === this.tile()) {
      this.gameService.setHoveredTile(null);
    }
  }

  protected potentialScore = computed(() => {
    const hoveredTile = this.gameService.hoveredTile();
    const selectedAnimal = this.gameService.selectedAnimal();

    if (!hoveredTile || selectedAnimal === null || !this.gameService.canPlaceSelectedAnimal(hoveredTile)) {
      return null;
    }

    const contributions = this.gameService.getScoreContributions(hoveredTile, selectedAnimal);

    return contributions.get(this.tile()) ?? null;
  });

  protected canShowPreview = computed(() => {
    const hoveredTile = this.gameService.hoveredTile();
    return hoveredTile === this.tile() &&
      this.gameService.selectedAnimal() !== null &&
      this.gameService.canPlaceSelectedAnimal(this.tile());
  });

  protected previewSvgPath = computed(() => {
    const selectedAnimal = this.gameService.selectedAnimal();
    if (selectedAnimal === null) return '';
    return ANIMAL_SVG_PATHS[selectedAnimal];
  });

  protected scoreText = computed(() => {
    const score = this.potentialScore();
    if (score === null) return '';
    return score > 0 ? `+${score}` : `${score}`;
  });
}
