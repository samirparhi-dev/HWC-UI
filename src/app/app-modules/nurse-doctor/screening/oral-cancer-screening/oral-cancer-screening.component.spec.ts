import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OralCancerScreeningComponent } from './oral-cancer-screening.component';

describe('OralCancerScreeningComponent', () => {
  let component: OralCancerScreeningComponent;
  let fixture: ComponentFixture<OralCancerScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OralCancerScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OralCancerScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
