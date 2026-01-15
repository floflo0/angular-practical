import { inject, Injectable} from '@angular/core';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal} from '@angular/cdk/portal';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private readonly router = inject(Router);

  private overlayRef: OverlayRef | undefined;

  public constructor(private readonly overlay: Overlay) {
    // Close the overlay if the page change due to the user going back.
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.dispose());
  }

  public open(type: ComponentType<any>, closeOnClick: boolean): void {
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    const filePreviewPortal = new ComponentPortal(type);

    if (closeOnClick) {
      this.overlayRef.backdropClick().subscribe(_ => {
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
      });
    }

    this.overlayRef.attach(filePreviewPortal);
  }

  public dispose(): void {
    this.overlayRef?.dispose();
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }
}
