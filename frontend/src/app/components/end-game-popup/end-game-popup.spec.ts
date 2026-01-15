import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndGamePopup } from './end-game-popup';

describe('EndGamePopup', () => {
  let component: EndGamePopup;
  let fixture: ComponentFixture<EndGamePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndGamePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndGamePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
