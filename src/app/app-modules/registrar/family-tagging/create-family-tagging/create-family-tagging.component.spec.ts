import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFamilyTaggingComponent } from './create-family-tagging.component';

describe('CreateFamilyTaggingComponent', () => {
  let component: CreateFamilyTaggingComponent;
  let fixture: ComponentFixture<CreateFamilyTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFamilyTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFamilyTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
