import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpForImmunizationComponent } from './follow-up-for-immunization.component';

describe('FollowUpForImmunizationComponent', () => {
  let component: FollowUpForImmunizationComponent;
  let fixture: ComponentFixture<FollowUpForImmunizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpForImmunizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpForImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
