import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TripService } from 'src/app/core/service/trip.service';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Trip } from 'src/app/models/trip.mode';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
  private tripService = inject(TripService);
  private uiToast = inject(UIToastService);

  trips: Trip[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadFeed();

    // ✅ Optional: auto-refresh when admin approves trip
    window.addEventListener('storage', (event) => {
      if (event.key === 'feedRefresh') this.loadFeed();
    });
  }

  // 🔹 Load feed trips (only approved ones)
  loadFeed() {
    this.isLoading = true;
    this.tripService.getFeed().subscribe({
      next: (res) => {
        console.log('🧾 Feed API Response:', res);
        this.trips = res.filter(t => t.status === 'APPROVED');
        console.log('✅ Approved Trips:', this.trips);
        this.isLoading = false;
      },
      error: () => {
        this.uiToast.showToast('Failed to load feed', 2000, 'danger');
        this.isLoading = false;
      },
    });
  }

  // 🔹 Pull-to-refresh action
  refreshFeed(event: any) {
    this.tripService.getFeed().subscribe({
      next: (res) => {
        this.trips = res.filter(t => t.status === 'APPROVED');
        event.target.complete();
      },
      error: () => {
        event.target.complete();
        this.uiToast.showToast('Failed to refresh', 2000, 'warning');
      },
    });
  }
}
