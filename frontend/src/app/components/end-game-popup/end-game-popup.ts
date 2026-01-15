import { Component, inject } from '@angular/core';
import { GameService } from '../../service/game-service';
import { Router } from '@angular/router';
import { OverlayService } from '../../service/overlay-service';

@Component({
  selector: 'app-end-game-popup',
  imports: [],
  templateUrl: './end-game-popup.html',
  styleUrl: './end-game-popup.css'
})
export class EndGamePopup {
  private readonly gameService: GameService = inject(GameService);
  private overlayService: OverlayService = inject(OverlayService);
  private readonly router = inject(Router);

  protected score = this.gameService.score;
  protected playerName = this.gameService.playerName;

  protected async returnToMenu() {
    await this.router.navigate(['/menu']);
    this.overlayService.dispose();
  }
}
