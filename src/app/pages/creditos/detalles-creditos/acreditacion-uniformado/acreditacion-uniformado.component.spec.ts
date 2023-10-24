import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionUniformadoComponent } from './acreditacion-uniformado.component';

describe('AcreditacionUniformadoComponent', () => {
  let component: AcreditacionUniformadoComponent;
  let fixture: ComponentFixture<AcreditacionUniformadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcreditacionUniformadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionUniformadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
