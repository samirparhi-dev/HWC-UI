import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiabetesScreeningComponent } from './diabetes-screening.component';

describe('DiabetesScreeningComponent', () => {
  let component: DiabetesScreeningComponent;
  let fixture: ComponentFixture<DiabetesScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiabetesScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiabetesScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
