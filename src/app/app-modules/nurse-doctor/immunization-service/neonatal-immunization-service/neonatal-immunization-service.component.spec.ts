import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonatalImmunizationServiceComponent } from './neonatal-immunization-service.component';

describe('NeonatalImmunizationServiceComponent', () => {
  let component: NeonatalImmunizationServiceComponent;
  let fixture: ComponentFixture<NeonatalImmunizationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeonatalImmunizationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeonatalImmunizationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
