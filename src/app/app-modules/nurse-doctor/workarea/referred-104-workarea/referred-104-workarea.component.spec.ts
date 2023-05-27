import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Referred104WorkareaComponent } from './referred-104-workarea.component';

describe('Referred104WorkareaComponent', () => {
  let component: Referred104WorkareaComponent;
  let fixture: ComponentFixture<Referred104WorkareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Referred104WorkareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Referred104WorkareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
