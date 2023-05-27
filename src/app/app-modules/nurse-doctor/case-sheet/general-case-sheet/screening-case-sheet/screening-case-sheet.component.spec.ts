import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningCaseSheetComponent } from './screening-case-sheet.component';

describe('ScreeningCaseSheetComponent', () => {
  let component: ScreeningCaseSheetComponent;
  let fixture: ComponentFixture<ScreeningCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreeningCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
