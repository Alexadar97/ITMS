import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalactionsComponent } from './approvalactions.component';

describe('ApprovalactionsComponent', () => {
  let component: ApprovalactionsComponent;
  let fixture: ComponentFixture<ApprovalactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
