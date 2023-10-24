import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsPendientesComponent } from './tickets-pendientes.component';

describe('TicketsPendientesComponent', () => {
  let component: TicketsPendientesComponent;
  let fixture: ComponentFixture<TicketsPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
