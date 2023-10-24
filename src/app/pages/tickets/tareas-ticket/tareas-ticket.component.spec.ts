import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasTicketComponent } from './tareas-ticket.component';

describe('TareasTicketComponent', () => {
  let component: TareasTicketComponent;
  let fixture: ComponentFixture<TareasTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TareasTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TareasTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
