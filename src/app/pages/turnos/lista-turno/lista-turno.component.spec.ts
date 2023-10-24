import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTurnoComponent } from './lista-turno.component';

describe('ListaTurnoComponent', () => {
  let component: ListaTurnoComponent;
  let fixture: ComponentFixture<ListaTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTurnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
