import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthImmunizationHistoryComponent } from './birth-immunization-history.component';

describe('BirthImmunizationHistoryComponent', () => {
  let component: BirthImmunizationHistoryComponent;
  let fixture: ComponentFixture<BirthImmunizationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthImmunizationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthImmunizationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
