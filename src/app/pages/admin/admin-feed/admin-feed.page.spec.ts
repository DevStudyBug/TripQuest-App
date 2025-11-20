import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFeedPage } from './admin-feed.page';

describe('AdminFeedPage', () => {
  let component: AdminFeedPage;
  let fixture: ComponentFixture<AdminFeedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
