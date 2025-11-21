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
    () => this.gameService.invetory()[Animal.BEAR],
  );
  protected readonly fishCount = computed(
    () => this.gameService.invetory()[Animal.FISH],
  );
  protected readonly foxCount = computed(
    () => this.gameService.invetory()[Animal.FOX],
  );

  protected selectBear() {
    this.gameService.selectAnial(Animal.BEAR);
  }

  protected selectFish() {
    this.gameService.selectAnial(Animal.FISH);
  }

  protected selectFox() {
    this.gameService.selectAnial(Animal.FOX);
  }
}
