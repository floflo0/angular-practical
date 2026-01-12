import { Component } from '@angular/core';
import { Map } from '../map/map';
import { InventorySelector } from '../inventory-selector/inventory-selector';
import { SelectedAnimal } from '../selected-animal/selected-animal';
import { Score } from '../score/score';
import {UndoRedo} from '../undo-redo/undo-redo';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [Map, InventorySelector, SelectedAnimal, Score, UndoRedo],
  templateUrl: './game-view.html',
  styleUrls: ['./game-view.css']
})
export class GameView {}
