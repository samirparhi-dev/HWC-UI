import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFamilyTaggingComponent } from './edit-family-tagging.component';

describe('EditFamilyTaggingComponent', () => {
  let component: EditFamilyTaggingComponent;
  let fixture: ComponentFixture<EditFamilyTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFamilyTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFamilyTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
