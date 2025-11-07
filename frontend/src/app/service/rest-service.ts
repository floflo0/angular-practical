import { Injectable } from '@angular/core';
import { MapModel } from '../models/map-model';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  // TODO: implement RestService.getMapNames
  public getMapNames(): string[] {
    return ['Map 1', 'Map 2', 'Map 3'];
  }

  // TODO: implement RestService.getMap
  public getMap(_name: string): MapModel {
    throw new Error('not implemented');
  }

  // TODO: implement RestService.getMapNames
  public saveMap(map: MapModel): void {
    console.log(`saving map ${map.name}`);
  }
}
