import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPlanningComponent } from './family-planning.component';


describe('FamilyPlanningComponent', () => {
  let component: FamilyPlanningComponent;
  let fixture: ComponentFixture<FamilyPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
