import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { InventorySelector } from './components/inventory-selector/inventory-selector';
import { SelectedAnimal } from './components/selected-animal/selected-animal';

@Component({
  selector: 'app-root',
  imports: [InventorySelector, RouterOutlet, SelectedAnimal, Map],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Web2 frontend');
}
