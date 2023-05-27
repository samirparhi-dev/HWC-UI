import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Referred104CdssDetailsComponent } from './referred-104-cdss-details.component';

describe('Referred104CdssDetailsComponent', () => {
  let component: Referred104CdssDetailsComponent;
  let fixture: ComponentFixture<Referred104CdssDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Referred104CdssDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Referred104CdssDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
