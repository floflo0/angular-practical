import { Injectable } from '@angular/core';
import { MapModel } from '../models/map-model';
import { MAP_SIZE } from './map-service';
import { TileModel } from '../models/tile-model';
import { TileType } from '../models/tile-type';

const API_ROOT: string = `${window.location.origin}/api/maps/`;

/**
 * Service to interact with the backend.
 */
@Injectable({
  providedIn: 'root'
})
export class RestService {
  /**
   * Make an HTTP request to the backend.
   *
   * @param url The URL of the request.
   * @param method The HTTP method (GET or POST).
   * @param body The body of the request.
   * @returns The response of the request.
   */
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

  /**
   * Get the map names from the backend.
   *
   * @returns The map names.
   */
  public async getMapNames(): Promise<string[]> {
    const url = new URL('', API_ROOT);
    const response = await this.request(url.toString());
    return await response.json() as Promise<string[]>;
  }

  /**
   * Get the map with the corresponding name from the backend.
   *
   * @param queryName The name of the map to get.
   * @returns The map with the corresponding name.
   */
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
    return new MapModel(name, tilesArray);
  }

  /**
   * Save a map to the backend.
   *
   * @param map The map to save to the backend.
   */
  public async saveMap(map: MapModel): Promise<void> {
    const { name, tiles } = map;
    const url = new URL('', API_ROOT);
    await this.request(url.toString(), 'POST', {
      name,
      tiles: tiles.flatMap(line => line.map(({ type }) => type)),
    });
  }
}
