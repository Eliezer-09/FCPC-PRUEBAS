import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidarCesantiaComponent } from './liquidar-cesantia.component';

describe('LiquidarCesantiaComponent', () => {
  let component: LiquidarCesantiaComponent;
  let fixture: ComponentFixture<LiquidarCesantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidarCesantiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidarCesantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
