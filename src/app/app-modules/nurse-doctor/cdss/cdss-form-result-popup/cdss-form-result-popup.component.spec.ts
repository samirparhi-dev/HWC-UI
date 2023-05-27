import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdssFormResultPopupComponent } from './cdss-form-result-popup.component';

describe('CdssFormResultPopupComponent', () => {
  let component: CdssFormResultPopupComponent;
  let fixture: ComponentFixture<CdssFormResultPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdssFormResultPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdssFormResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
