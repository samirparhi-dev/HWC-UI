import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfantBirthDetailsComponent } from './infant-birth-details.component';

describe('InfantBirthDetailsComponent', () => {
  let component: InfantBirthDetailsComponent;
  let fixture: ComponentFixture<InfantBirthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfantBirthDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfantBirthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
