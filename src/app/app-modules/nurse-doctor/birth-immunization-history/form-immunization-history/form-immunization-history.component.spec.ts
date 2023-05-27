import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImmunizationHistoryComponent } from './form-immunization-history.component';

describe('FormImmunizationHistoryComponent', () => {
  let component: FormImmunizationHistoryComponent;
  let fixture: ComponentFixture<FormImmunizationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImmunizationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImmunizationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
