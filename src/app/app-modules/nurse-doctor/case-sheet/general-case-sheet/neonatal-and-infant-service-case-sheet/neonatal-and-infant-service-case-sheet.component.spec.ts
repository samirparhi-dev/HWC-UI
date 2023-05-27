import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonatalAndInfantServiceCaseSheetComponent } from './neonatal-and-infant-service-case-sheet.component';

describe('NeonatalAndInfantServiceCaseSheetComponent', () => {
  let component: NeonatalAndInfantServiceCaseSheetComponent;
  let fixture: ComponentFixture<NeonatalAndInfantServiceCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeonatalAndInfantServiceCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeonatalAndInfantServiceCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
