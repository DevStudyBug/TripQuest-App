import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripReportModalComponent } from './trip-report-modal.component';

describe('TripReportModalComponent', () => {
  let component: TripReportModalComponent;
  let fixture: ComponentFixture<TripReportModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TripReportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TripReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
