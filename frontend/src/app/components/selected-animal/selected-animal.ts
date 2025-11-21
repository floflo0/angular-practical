import { Component, computed, inject } from '@angular/core';
import { Animal } from '../../models/animal';
import { GameService } from '../../service/game-service';

const SVG_PATHS = {
  [Animal.BEAR]: 'bear.svg',
  [Animal.FISH]: 'fish.svg',
  [Animal.FOX]: 'fox.svg',
}

@Component({
  selector: 'app-selected-animal',
  imports: [],
  templateUrl: './selected-animal.html',
  styleUrl: './selected-animal.css'
})
export class SelectedAnimal {
  private readonly gameService: GameService = inject(GameService);
  protected readonly selectedAnimal = this.gameService.selectedAnimal;
  protected svgPath = computed(() => {
    const selectedAnimal = this.selectedAnimal();
    if (selectedAnimal === null) return '';
    return SVG_PATHS[selectedAnimal];
  });
}
