import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsReportsComponent } from './cards-reports.component';

describe('CardsReportsComponent', () => {
  let component: CardsReportsComponent;
  let fixture: ComponentFixture<CardsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
