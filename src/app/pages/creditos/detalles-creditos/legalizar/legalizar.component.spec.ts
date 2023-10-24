import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizarComponent } from './legalizar.component';

describe('LegalizarComponent', () => {
  let component: LegalizarComponent;
  let fixture: ComponentFixture<LegalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
