import { Component, computed, inject } from '@angular/core';
import { GameService } from '../../service/game-service';
import { Animal } from '../../models/animal';

@Component({
  selector: 'app-inventory-selector',
  imports: [],
  templateUrl: './inventory-selector.html',
  styleUrl: './inventory-selector.css'
})
export class InventorySelector {

  private readonly gameService: GameService = inject(GameService);

  protected readonly bearCount = computed(
    () => this.gameService.inventory()[Animal.BEAR],
  );
  protected readonly fishCount = computed(
    () => this.gameService.inventory()[Animal.FISH],
  );
  protected readonly foxCount = computed(
    () => this.gameService.inventory()[Animal.FOX],
  );

  protected selectBear() {
    this.gameService.selectAnimal(Animal.BEAR);
  }

  protected selectFish() {
    this.gameService.selectAnimal(Animal.FISH);
  }

  protected selectFox() {
    this.gameService.selectAnimal(Animal.FOX);
  }
}
