import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsInternoComponent } from './tickets-interno.component';

describe('TicketsInternoComponent', () => {
  let component: TicketsInternoComponent;
  let fixture: ComponentFixture<TicketsInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
