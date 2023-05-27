import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildhoodOralVitaminComponent } from './childhood-oral-vitamin.component';

describe('ChildhoodOralVitaminComponent', () => {
  let component: ChildhoodOralVitaminComponent;
  let fixture: ComponentFixture<ChildhoodOralVitaminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildhoodOralVitaminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildhoodOralVitaminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
