import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitKpiViewComponent } from './unit-kpi-view.component';

describe('UnitKpiViewComponent', () => {
  let component: UnitKpiViewComponent;
  let fixture: ComponentFixture<UnitKpiViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitKpiViewComponent]
    });
    fixture = TestBed.createComponent(UnitKpiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
