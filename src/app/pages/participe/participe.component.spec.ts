import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipeComponent } from './participe.component';

describe('ParticipeComponent', () => {
  let component: ParticipeComponent;
  let fixture: ComponentFixture<ParticipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
