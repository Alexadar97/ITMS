import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeadminComponent } from './employeeadmin.component';

describe('EmployeeadminComponent', () => {
  let component: EmployeeadminComponent;
  let fixture: ComponentFixture<EmployeeadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
