import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPlanningCaseSheetComponent } from './family-planning-case-sheet.component';


describe('FamilyPlanningCaseSheetComponent', () => {
  let component: FamilyPlanningCaseSheetComponent;
  let fixture: ComponentFixture<FamilyPlanningCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyPlanningCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPlanningCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
