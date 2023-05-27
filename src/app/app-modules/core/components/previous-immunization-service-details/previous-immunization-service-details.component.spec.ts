import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousImmunizationServiceDetailsComponent } from './previous-immunization-service-details.component';

describe('PreviousImmunizationServiceDetailsComponent', () => {
  let component: PreviousImmunizationServiceDetailsComponent;
  let fixture: ComponentFixture<PreviousImmunizationServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousImmunizationServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousImmunizationServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
