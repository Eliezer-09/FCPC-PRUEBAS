import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConveniosPagosComponent } from './convenios-pagos.component';

describe('ConveniosPagosComponent', () => {
  let component: ConveniosPagosComponent;
  let fixture: ComponentFixture<ConveniosPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConveniosPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConveniosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
