import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySelector } from './inventory-selector';

describe('InventorySelector', () => {
  let component: InventorySelector;
  let fixture: ComponentFixture<InventorySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
