import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Referred104BeneficiaryDetailsComponent } from './referred-104-beneficiary-details.component';

describe('Referred104BeneficiaryDetailsComponent', () => {
  let component: Referred104BeneficiaryDetailsComponent;
  let fixture: ComponentFixture<Referred104BeneficiaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Referred104BeneficiaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Referred104BeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
