import { Component, HostBinding, inject } from '@angular/core';
import { GameService } from '../../service/game-service';

@Component({
  selector: 'app-score',
  imports: [],
  templateUrl: './score.html',
  styleUrl: './score.css'
})
export class Score {

  private readonly gameService: GameService = inject(GameService);

  protected readonly score = this.gameService.score;
  protected readonly scoreLimit = this.gameService.scoreLimit;
  protected readonly turn = this.gameService.turn;

  @HostBinding('style.--progress')
  protected get mapSize(): number {
    return this.score() / this.scoreLimit();
  }
}
