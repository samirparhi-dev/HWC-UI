import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentsOnSideEffectsComponent } from './treatments-on-side-effects.component';

describe('TreatmentsOnSideEffectsComponent', () => {
  let component: TreatmentsOnSideEffectsComponent;
  let fixture: ComponentFixture<TreatmentsOnSideEffectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentsOnSideEffectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentsOnSideEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
