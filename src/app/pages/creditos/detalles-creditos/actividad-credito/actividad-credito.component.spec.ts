import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadCreditoComponent } from './actividad-credito.component';

describe('ActividadCreditoComponent', () => {
  let component: ActividadCreditoComponent;
  let fixture: ComponentFixture<ActividadCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
