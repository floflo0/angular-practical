import { Component } from '@angular/core';
import { InteractoModule } from 'interacto-angular';

@Component({
  selector: 'app-undo-redo',
  imports: [InteractoModule],
  templateUrl: './undo-redo.html',
  styleUrl: './undo-redo.css'
})
export class UndoRedo {}
