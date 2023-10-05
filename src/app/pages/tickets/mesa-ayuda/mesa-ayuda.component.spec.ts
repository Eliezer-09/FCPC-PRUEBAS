import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaAyudaComponent } from './mesa-ayuda.component';

describe('MesaAyudaComponent', () => {
  let component: MesaAyudaComponent;
  let fixture: ComponentFixture<MesaAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesaAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
