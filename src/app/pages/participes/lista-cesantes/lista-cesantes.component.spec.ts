import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCesantesComponent } from './lista-cesantes.component';

describe('ListaCesantesComponent', () => {
  let component: ListaCesantesComponent;
  let fixture: ComponentFixture<ListaCesantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCesantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCesantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
