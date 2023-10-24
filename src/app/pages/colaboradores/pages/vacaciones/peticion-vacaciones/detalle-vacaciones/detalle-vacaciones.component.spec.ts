import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVacacionesComponent } from './detalle-vacaciones.component';

describe('DetalleVacacionesComponent', () => {
  let component: DetalleVacacionesComponent;
  let fixture: ComponentFixture<DetalleVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
