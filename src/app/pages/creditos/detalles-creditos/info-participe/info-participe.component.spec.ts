import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoParticipeComponent } from './info-participe.component';

describe('InfoParticipeComponent', () => {
  let component: InfoParticipeComponent;
  let fixture: ComponentFixture<InfoParticipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoParticipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoParticipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
