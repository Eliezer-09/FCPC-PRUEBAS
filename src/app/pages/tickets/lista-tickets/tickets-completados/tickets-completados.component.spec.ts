import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCompletadosComponent } from './tickets-completados.component';

describe('TicketsCompletadosComponent', () => {
  let component: TicketsCompletadosComponent;
  let fixture: ComponentFixture<TicketsCompletadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCompletadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCompletadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
