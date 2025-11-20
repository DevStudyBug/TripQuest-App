import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Trip } from 'src/app/models/trip.mode';
import { TripService } from 'src/app/core/service/trip.service';

@Component({
  selector: 'app-admin-feed',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './admin-feed.page.html',
  styleUrls: ['./admin-feed.page.scss'],
})
export class AdminFeedPage implements OnInit {
  private http = inject(HttpClient);
  private uiToast = inject(UIToastService);
  private alertCtrl = inject(AlertController);
  private tripService = inject(TripService);

  trips: Trip[] = [];
  isLoading = false;
  private apiUrl = `${environment.apiBaseUrl}/admin/trips`;

  ngOnInit() {
  this.isLoading = true;

  //  Subscribe to the shared feed
  this.tripService.getFeed().subscribe((trips) => {
    this.trips = trips;
    this.isLoading = false;
  });

  //  Load initial data once
  this.tripService.loadFeed();
}


  // Load all approved trips
  loadFeed() {
    this.isLoading = true;
    this.tripService.getFeed().subscribe({
      next: (res) => {
        this.trips = res.filter((t) => t.status === 'APPROVED');
        this.isLoading = false;
      },
      error: () => {
        this.uiToast.showToast('Failed to load feed', 2000, 'danger');
        this.isLoading = false;
      },
    });
  }

  //  Action Menu
  async confirmAction(trip: Trip) {
    const alert = await this.alertCtrl.create({
      header: `Manage Trip`,
      message: `What would you like to do with "${trip.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: trip.isFeatured === 'true' ? 'Unfeature' : 'Feature',
          handler: () => this.toggleFeature(trip),
        },
        {
          text: 'Reject Trip',
          role: 'destructive',
          handler: () => this.confirmReject(trip.id!),
        },
      ],
    });
    await alert.present();
  }

  // Confirm rejection reason
  async confirmReject(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Reject Trip',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'Enter reason for rejection...',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reject',
          handler: (data) => {
            const reason = data.reason?.trim() || 'No reason provided';
            this.rejectTrip(id, reason);
          },
        },
      ],
    });
    await alert.present();
  }

  //  Toggle Feature
  toggleFeature(trip: Trip) {
    const featured = trip.isFeatured === 'true' ? false : true;
    this.http
      .put(`${this.apiUrl}/${trip.id}/feature?featured=${featured}`, {})
      .subscribe({
        next: () => {
          trip.isFeatured = featured ? 'true' : 'false';
          this.uiToast.showToast(
            featured ? 'Trip marked as featured!' : 'Trip unfeatured!',
            1500,
            featured ? 'success' : 'medium'
          );
        },
        error: () =>
          this.uiToast.showToast('Failed to update feature', 1500, 'danger'),
      });
  }

  // Reject Trip
  rejectTrip(id: number, reason: string) {
    this.http
      .put(`${this.apiUrl}/${id}/reject?reason=${encodeURIComponent(reason)}`, {})
      .subscribe({
        next: () => {
          this.trips = this.trips.filter((t) => t.id !== id);
          this.uiToast.showToast('Trip rejected successfully', 1500, 'warning');
        },
        error: () =>
          this.uiToast.showToast('Failed to reject trip', 1500, 'danger'),
      });
  }
}
