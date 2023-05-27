import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPlanningAndReproductiveComponent } from './family-planning-and-reproductive-details.component';


describe('FamilyPlanningAndReproductiveComponent', () => {
  let component: FamilyPlanningAndReproductiveComponent;
  let fixture: ComponentFixture<FamilyPlanningAndReproductiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyPlanningAndReproductiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPlanningAndReproductiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
