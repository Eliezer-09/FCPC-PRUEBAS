import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesReporteComponent } from './reportes-reporte.component';

describe('ReportesReporteComponent', () => {
  let component: ReportesReporteComponent;
  let fixture: ComponentFixture<ReportesReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
