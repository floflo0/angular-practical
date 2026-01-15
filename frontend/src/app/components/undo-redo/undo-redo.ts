import { Component, inject } from '@angular/core';
import { InteractoModule } from 'interacto-angular';
import { GameService } from '../../service/game-service';

@Component({
  selector: 'app-undo-redo',
  imports: [InteractoModule],
  templateUrl: './undo-redo.html',
  styleUrl: './undo-redo.css'
})
export class UndoRedo {
  private readonly gameService: GameService = inject(GameService);

  protected handleEndGameButtonClick() {
    this.gameService.terminateGame();
  }
}
