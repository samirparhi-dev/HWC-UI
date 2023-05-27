import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nurse104RefferedWorklistComponent } from './nurse-104-reffered-worklist.component';

describe('Nurse104RefferedWorklistComponent', () => {
  let component: Nurse104RefferedWorklistComponent;
  let fixture: ComponentFixture<Nurse104RefferedWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nurse104RefferedWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nurse104RefferedWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
