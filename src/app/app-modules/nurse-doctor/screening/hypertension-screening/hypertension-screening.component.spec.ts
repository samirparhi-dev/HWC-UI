import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypertensionScreeningComponent } from './hypertension-screening.component';

describe('HypertensionScreeningComponent', () => {
  let component: HypertensionScreeningComponent;
  let fixture: ComponentFixture<HypertensionScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypertensionScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypertensionScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
