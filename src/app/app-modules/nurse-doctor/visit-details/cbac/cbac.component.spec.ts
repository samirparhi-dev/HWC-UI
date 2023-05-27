import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbacComponent } from './cbac.component';

describe('CbacComponent', () => {
  let component: CbacComponent;
  let fixture: ComponentFixture<CbacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
