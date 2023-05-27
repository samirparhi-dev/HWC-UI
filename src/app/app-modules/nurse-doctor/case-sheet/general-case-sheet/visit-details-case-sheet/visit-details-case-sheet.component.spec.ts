import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDeatilsCaseSheetComponent } from './visit-details-case-sheet.component';

describe('VisitDeatilsCaseSheetComponent', () => {
  let component: VisitDeatilsCaseSheetComponent;
  let fixture: ComponentFixture<VisitDeatilsCaseSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitDeatilsCaseSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitDeatilsCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
