import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Referred104DetailsPopupComponent } from './referred-104-details-popup.component';

describe('Referred104DetailsPopupComponent', () => {
  let component: Referred104DetailsPopupComponent;
  let fixture: ComponentFixture<Referred104DetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Referred104DetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Referred104DetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
