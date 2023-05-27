import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensationDetailsComponent } from './dispensation-details.component';

describe('DispensationDetailsComponent', () => {
  let component: DispensationDetailsComponent;
  let fixture: ComponentFixture<DispensationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispensationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
