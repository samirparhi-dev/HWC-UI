import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonatalPatientVitalsComponent } from './neonatal-patient-vitals.component';

describe('NeonatalPatientVitalsComponent', () => {
  let component: NeonatalPatientVitalsComponent;
  let fixture: ComponentFixture<NeonatalPatientVitalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeonatalPatientVitalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeonatalPatientVitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
