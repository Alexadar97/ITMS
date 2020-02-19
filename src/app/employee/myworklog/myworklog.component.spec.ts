import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyworklogComponent } from './myworklog.component';

describe('MyworklogComponent', () => {
  let component: MyworklogComponent;
  let fixture: ComponentFixture<MyworklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyworklogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyworklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
