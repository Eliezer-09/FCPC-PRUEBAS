import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitarTicketComponent } from './modal-solicitar-ticket.component';

describe('ModalSolicitarTicketComponent', () => {
  let component: ModalSolicitarTicketComponent;
  let fixture: ComponentFixture<ModalSolicitarTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSolicitarTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSolicitarTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
