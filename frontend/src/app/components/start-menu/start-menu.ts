import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../service/map-service';
import { RestService } from '../../service/rest-service';
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
  private readonly restService = inject(RestService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  protected readonly mapNames = signal<string[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly playerName = signal<string>('');

  async ngOnInit() {
    try {
      const names = await this.restService.getMapNames();
      this.mapNames.set(names);
    } catch (error) {
      console.error('Failed to load map names', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMap(name: string) {
    try {
      const map = await this.restService.getMap(name);
      this.gameService.createGame(this.playerName() || 'Anonymous Player', map);
      await this.router.navigate(['/game']);
    } catch (error) {
      console.error('Failed to load map', error);
    }
  }

  generateNewMap() {
    const map = this.mapService.generateNewMap();
    this.gameService.createGame(this.playerName() || 'Anonymous Player', map);
    this.router.navigate(['/game']).then(success => {
      if (!success) console.error('Failed to navigate to game after generating new map');
    });
  }

  updatePlayerName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerName.set(input.value);
  }
}
