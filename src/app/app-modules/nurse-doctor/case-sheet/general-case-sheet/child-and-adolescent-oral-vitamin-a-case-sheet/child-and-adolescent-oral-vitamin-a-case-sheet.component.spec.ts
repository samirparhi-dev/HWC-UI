import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildAndAdolescentOralVitaminACaseSheetComponent } from './child-and-adolescent-oral-vitamin-a-case-sheet.component';

describe('ChildAndAdolescentOralVitaminACaseSheetComponent', () => {
  let component: ChildAndAdolescentOralVitaminACaseSheetComponent;
  let fixture: ComponentFixture<ChildAndAdolescentOralVitaminACaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildAndAdolescentOralVitaminACaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildAndAdolescentOralVitaminACaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
