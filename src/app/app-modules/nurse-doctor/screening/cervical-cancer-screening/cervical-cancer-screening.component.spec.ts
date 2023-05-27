import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervicalCancerScreeningComponent } from './cervical-cancer-screening.component';


describe('CervicalCancerScreeningComponent', () => {
  let component: CervicalCancerScreeningComponent;
  let fixture: ComponentFixture<CervicalCancerScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CervicalCancerScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervicalCancerScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
