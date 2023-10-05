import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDescuentosComponent } from './generar-descuentos.component';

describe('GenerarDescuentosComponent', () => {
  let component: GenerarDescuentosComponent;
  let fixture: ComponentFixture<GenerarDescuentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarDescuentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarDescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
