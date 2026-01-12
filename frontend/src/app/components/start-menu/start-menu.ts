import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../service/map-service';
import { GameService } from '../../service/game-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.css'
})
export class StartMenu implements OnInit {
  private readonly mapService = inject(MapService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  protected readonly mapNames = signal<string[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly playerName = signal<string>('');

  async ngOnInit() {
    try {
      const names = await this.mapService.getMapNames();
      this.mapNames.set(names);
    } catch (error) {
      console.error('Failed to load map names', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMap(name: string) {
    this.gameService.setPlayerName(this.playerName() || 'Anonymous Player');
    await this.router.navigate(['/game', name]);
  }

  async generateNewMap() {
    const map = this.mapService.generateNewMap();
    try {
      await this.mapService.saveMap(map);
      this.gameService.setPlayerName(this.playerName() || 'Anonymous Player');
      await this.router.navigate(['/game', map.name]);
    } catch (error) {
      console.error('Failed to save new map', error);
    }
  }

  updatePlayerName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerName.set(input.value);
  }
}
