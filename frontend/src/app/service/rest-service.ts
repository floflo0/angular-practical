import { Injectable } from '@angular/core';
import { MapModel } from '../models/map-model';
import { MAP_SIZE } from './map-service';
import { TileType } from '../models/tile-type';
import { TileModel } from '../models/tile-model';

const API_ROOT: string = `${window.location.origin}/api/maps/`;

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private async request(url: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<Response> {
    const headers: Record<string, string> = {};
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      const { status, error } = await response.json();
      throw new Error(`${status}: ${error}`);
    }
    return response;
  }

  public async getMapNames(): Promise<string[]> {
    const url = new URL('', API_ROOT);
    const response = await this.request(url.toString());
    return await response.json() as Promise<string[]>;
  }

  public async getMap(queryName: string): Promise<MapModel> {
    const url = new URL('by-name', API_ROOT);
    url.searchParams.set('name', queryName);
    const response = await this.request(url.toString());
    const { name, tiles } = await response.json() as { name: string, tiles: TileType[] };
    const tilesArray: TileModel[][] = [];
    console.assert(tiles.length === MAP_SIZE * MAP_SIZE);
    for (let y = 0; y < MAP_SIZE; ++y) {
      tilesArray.push(tiles.slice(y * MAP_SIZE, (y + 1) * MAP_SIZE).map((tile, x) => new TileModel(
        tile,
        x,
        y,
      )));
    }
    const map = new MapModel(name, tilesArray);
    return map;
  }

  public async saveMap(map: MapModel): Promise<void> {
    const { name, tiles } = map;
    const url = new URL('', API_ROOT);
    await this.request(url.toString(), 'POST', {
      name,
      tiles: tiles.flatMap(line => line.map(({ type }) => type)),
    });
  }
}
