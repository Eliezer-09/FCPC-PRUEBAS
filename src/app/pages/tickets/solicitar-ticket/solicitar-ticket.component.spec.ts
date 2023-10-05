import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarTicketComponent } from './solicitar-ticket.component';

describe('SolicitarTicketComponent', () => {
  let component: SolicitarTicketComponent;
  let fixture: ComponentFixture<SolicitarTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
