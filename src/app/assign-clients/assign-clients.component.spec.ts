import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClientsComponent } from './assign-clients.component';

describe('AssignClientsComponent', () => {
  let component: AssignClientsComponent;
  let fixture: ComponentFixture<AssignClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
