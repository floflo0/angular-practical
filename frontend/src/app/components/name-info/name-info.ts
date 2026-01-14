import {Component, computed, inject} from '@angular/core';
import {MapService} from '../../service/map-service';
import {GameService} from '../../service/game-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-name-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './name-info.html',
  styleUrl: './name-info.css'
})
export class NameInfo {
  private readonly gameService = inject(GameService);
  private readonly mapService = inject(MapService);

  protected readonly playerName = this.gameService.playerName;
  protected readonly mapName = computed(() => this.mapService.currentMap().name);

  protected readonly MIN_PLAYER_NAME_LENGTH = this.gameService.MIN_PLAYER_NAME_LENGTH;
  protected readonly MAX_PLAYER_NAME_LENGTH = this.gameService.MAX_PLAYER_NAME_LENGTH;

  protected readonly validName = computed(() => {
    const name = this.playerName().trim();
    return name.length >= this.gameService.MIN_PLAYER_NAME_LENGTH &&
      name.length <= this.gameService.MAX_PLAYER_NAME_LENGTH;
  });

  updatePlayerName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value;
    this.gameService.setPlayerName(newName);
  }
}
