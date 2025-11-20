import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageDestinationsPage } from './manage-destinations.page';

describe('ManageDestinationsPage', () => {
  let component: ManageDestinationsPage;
  let fixture: ComponentFixture<ManageDestinationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDestinationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
