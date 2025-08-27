import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedKpiViewComponent } from './assigned-kpi-view.component';

describe('AssignedKpiViewComponent', () => {
  let component: AssignedKpiViewComponent;
  let fixture: ComponentFixture<AssignedKpiViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedKpiViewComponent]
    });
    fixture = TestBed.createComponent(AssignedKpiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
