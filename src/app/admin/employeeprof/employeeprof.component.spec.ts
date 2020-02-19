import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeprofComponent } from './employeeprof.component';

describe('EmployeeprofComponent', () => {
  let component: EmployeeprofComponent;
  let fixture: ComponentFixture<EmployeeprofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeprofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeprofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
