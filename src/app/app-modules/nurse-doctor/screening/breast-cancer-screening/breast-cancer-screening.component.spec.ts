import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreastCancerScreeningComponent } from './breast-cancer-screening.component';

describe('BreastCancerScreeningComponent', () => {
  let component: BreastCancerScreeningComponent;
  let fixture: ComponentFixture<BreastCancerScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreastCancerScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreastCancerScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
