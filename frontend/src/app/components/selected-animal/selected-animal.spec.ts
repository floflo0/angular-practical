import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAnimal } from './selected-animal';

describe('SelectedAnimal', () => {
  let component: SelectedAnimal;
  let fixture: ComponentFixture<SelectedAnimal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedAnimal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedAnimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
