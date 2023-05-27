import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTaggingDetailsComponent } from './family-tagging-details.component';

describe('FamilyTaggingDetailsComponent', () => {
  let component: FamilyTaggingDetailsComponent;
  let fixture: ComponentFixture<FamilyTaggingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyTaggingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTaggingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
