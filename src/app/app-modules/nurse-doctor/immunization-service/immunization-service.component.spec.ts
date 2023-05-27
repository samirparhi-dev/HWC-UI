import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationServiceComponent } from './immunization-service.component';

describe('ImmunizationServiceComponent', () => {
  let component: ImmunizationServiceComponent;
  let fixture: ComponentFixture<ImmunizationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmunizationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmunizationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
