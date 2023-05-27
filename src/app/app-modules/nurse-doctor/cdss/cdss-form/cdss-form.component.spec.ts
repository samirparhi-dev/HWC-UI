import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdssFormComponent } from './cdss-form.component';

describe('CdssFormComponent', () => {
  let component: CdssFormComponent;
  let fixture: ComponentFixture<CdssFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdssFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdssFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
