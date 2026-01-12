import { UndoableCommand } from 'interacto';
import { Animal } from '../models/animal';
import { GameService } from '../service/game-service';
import { TileModel } from '../models/tile-model';
import { MapModel } from '../models/map-model';
import { MapService } from '../service/map-service';

export class PlaceAnimalCommand extends UndoableCommand {
  private mementoTurn?: number;
  private mementoScore?: number;
  private mementoScoreLimit?: number;
  private mementoSelectedAnimal?: Animal | null;
  private mementoInventory?: Record<Animal, number>;
  private mementoMap?: MapModel;

  public constructor(
    private readonly gameService: GameService,
    private readonly mapService: MapService,
    private readonly tile: TileModel,
  ) {
    super();
  }

  protected override createMemento(): void {
    this.mementoTurn = this.gameService.turn();
    this.mementoScore = this.gameService.score();
    this.mementoScoreLimit = this.gameService.scoreLimit();
    this.mementoSelectedAnimal = this.gameService.selectedAnimal();
    this.mementoInventory = { ...this.gameService.inventory() };
    this.mementoMap = this.mapService.currentMap().clone();
  }

  public override execution(): Promise<void> | void {
    this.gameService.placeSelectedAnimal(this.tile);
  }

  public override undo(): void {
    console.assert(this.mementoTurn !== undefined, 'mementoTurn has not been initialized');
    console.assert(this.mementoScore !== undefined, 'mementoScore has not been initialized');
    console.assert(this.mementoScoreLimit !== undefined, 'mementoScoreLimit has not been initialized');
    console.assert(this.mementoInventory !== undefined, 'mementoInventory has not been initialized');
    console.assert(this.mementoMap !== undefined, 'mementoMap has not been initialized');
    this.gameService.restoreState(
      this.mementoTurn!,
      this.mementoScore!,
      this.mementoScoreLimit!,
      { ...this.mementoInventory! },
      this.mementoMap!.clone(),
    );
  }

  public override redo(): void {
    console.assert(this.mementoSelectedAnimal !== undefined, 'mementoSelectedAnimal has not been initialized');
    console.assert(this.gameService.inventory()[this.mementoSelectedAnimal as Animal] !== 0);
    this.gameService.selectAnimal(this.mementoSelectedAnimal as Animal | null);
    this.execution();
  }
}
