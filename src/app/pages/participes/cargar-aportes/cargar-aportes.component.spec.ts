import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarAportesComponent } from './cargar-aportes.component';

describe('CargarAportesComponent', () => {
  let component: CargarAportesComponent;
  let fixture: ComponentFixture<CargarAportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarAportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarAportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
