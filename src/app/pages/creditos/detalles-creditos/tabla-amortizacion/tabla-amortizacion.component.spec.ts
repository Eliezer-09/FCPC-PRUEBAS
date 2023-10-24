import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAmortizacionComponent } from './tabla-amortizacion.component';

describe('TablaAmortizacionComponent', () => {
  let component: TablaAmortizacionComponent;
  let fixture: ComponentFixture<TablaAmortizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaAmortizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaAmortizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
