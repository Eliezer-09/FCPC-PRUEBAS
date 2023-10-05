import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCesanteComponent } from './info-cesante.component';

describe('InfoCesanteComponent', () => {
  let component: InfoCesanteComponent;
  let fixture: ComponentFixture<InfoCesanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoCesanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCesanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
