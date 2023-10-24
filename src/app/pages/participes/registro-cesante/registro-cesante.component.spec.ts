import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCesanteComponent } from './registro-cesante.component';

describe('RegistroCesanteComponent', () => {
  let component: RegistroCesanteComponent;
  let fixture: ComponentFixture<RegistroCesanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCesanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCesanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
