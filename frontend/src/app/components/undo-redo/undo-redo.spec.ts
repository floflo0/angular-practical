import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRedo } from './undo-redo';

describe('UndoRedo', () => {
  let component: UndoRedo;
  let fixture: ComponentFixture<UndoRedo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoRedo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoRedo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
