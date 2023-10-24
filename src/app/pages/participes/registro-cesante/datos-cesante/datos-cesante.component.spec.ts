import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCesanteComponent } from './datos-cesante.component';

describe('DatosCesanteComponent', () => {
  let component: DatosCesanteComponent;
  let fixture: ComponentFixture<DatosCesanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosCesanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCesanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
