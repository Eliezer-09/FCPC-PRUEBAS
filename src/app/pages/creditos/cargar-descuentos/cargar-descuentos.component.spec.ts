import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarDescuentosComponent } from './cargar-descuentos.component';

describe('CargarDescuentosComponent', () => {
  let component: CargarDescuentosComponent;
  let fixture: ComponentFixture<CargarDescuentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarDescuentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarDescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
