import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController ,ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Trip } from 'src/app/models/trip.mode';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { TripReportModalComponent } from '../trip-report-modal/trip-report-modal.component';
import { TripService } from 'src/app/core/service/trip.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {
  private http = inject(HttpClient);
  private uiToast = inject(UIToastService);
  private alertCtrl = inject(AlertController);
  private auth = inject(AuthService);
  private router = inject(Router);
    private modalCtrl = inject(ModalController);
private tripService = inject(TripService);
  pendingTrips: Trip[] = [];
  approvedTrips: Trip[] = [];
  rejectedTrips: Trip[] = [];
  isLoading = false;

  private apiUrl = `${environment.apiBaseUrl}/admin/trips`;

  ngOnInit() {
    this.loadDashboard();
  }

  //  Load all trip categories
  loadDashboard() {
    this.isLoading = true;
    Promise.all([
      this.http.get<Trip[]>(`${this.apiUrl}/pending`).toPromise(),
      this.http.get<Trip[]>(`${environment.apiBaseUrl}/trips/feed`).toPromise(),
      this.http.get<Trip[]>(`${this.apiUrl}/rejected`).toPromise(),
    ])
      .then(([pending, approved, rejected]) => {
        this.pendingTrips = pending || [];
        this.approvedTrips = approved || [];
        this.rejectedTrips = rejected || [];
      })
      .catch(() => this.uiToast.showToast('Failed to load trips', 2000, 'danger'))
      .finally(() => (this.isLoading = false));
  }

  //  Confirm Approve / Reject
  async confirmAction(id: number, type: 'approve' | 'reject') {
    if (type === 'approve') {
      const alert = await this.alertCtrl.create({
        header: 'Approve Trip',
        message: 'Are you sure you want to approve this trip?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Approve',
            handler: () => this.approveTrip(id),
          },
        ],
      });
      await alert.present();
    } else {
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
              this.rejectTrip(id, reason); //  Pass reason
            },
          },
        ],
      });
      await alert.present();
    }
  }

  // Approve Trip
  approveTrip(id: number) {
    this.http.put<Trip>(`${this.apiUrl}/${id}/approve`, {}).subscribe({
      next: (res) => {
        this.uiToast.showToast('Trip approved successfully!', 1500, 'success');
        this.pendingTrips = this.pendingTrips.filter((t) => t.id !== id);
        this.rejectedTrips = this.rejectedTrips.filter((t) => t.id !== id);
        this.approvedTrips.push(res);
        // Instantly reflect in Feed
      this.tripService.addTripToFeed(res);
      },
      error: () =>
        this.uiToast.showToast('Failed to approve trip', 1500, 'danger'),
    });
  }

  // Reject Trip (with reason)
  rejectTrip(id: number, reason: string) {
    this.http.put<Trip>(`${this.apiUrl}/${id}/reject`, { rejectionReason: reason }).subscribe({
      next: (res) => {
        this.uiToast.showToast('Trip rejected successfully!', 1500, 'warning');
        this.pendingTrips = this.pendingTrips.filter((t) => t.id !== id);
        this.approvedTrips = this.approvedTrips.filter((t) => t.id !== id);
        this.rejectedTrips.push(res);
        //  Instantly remove from Feed
        this.tripService.removeTripFromFeed(id);
      },
      error: () =>
        this.uiToast.showToast('Failed to reject trip', 1500, 'danger'),
    });
  }

  // Take Action on Rejected Trip
  async takeActionOnRejected(trip: Trip) {
    const alert = await this.alertCtrl.create({
      header: 'Take Action',
      message: `What would you like to do with "${trip.title}"?`,
      buttons: [
        {
          text: 'Check Report',
          handler: () => this.checkReport(trip),
        },
        {
          text: 'Approve Again',
          handler: () => this.approveTrip(trip.id!),
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

 async checkReport(trip: Trip) {
  const modal = await this.modalCtrl.create({
    component: TripReportModalComponent,
    componentProps: { trip },
  });

  await modal.present();

  const { role, data } = await modal.onDidDismiss();
  if (role === 'approve') {
    this.approveTrip(data.id!);
  }
}

  //  Feature / Unfeature
  async confirmFeature(trip: Trip) {
    const isFeatured = trip.isFeatured === 'true';
    const alert = await this.alertCtrl.create({
      header: isFeatured ? 'Unfeature Trip' : 'Feature Trip',
      message: isFeatured
        ? 'Unmark this trip as featured?'
        : 'Mark this trip as featured?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: isFeatured ? 'Unfeature' : 'Feature',
          handler: () => this.toggleFeature(trip),
        },
      ],
    });
    await alert.present();
  }

  toggleFeature(trip: Trip) {
    const featured = trip.isFeatured === 'true' ? false : true;
    this.http
      .put<Trip>(`${this.apiUrl}/${trip.id}/feature?featured=${featured}`, {})
      .subscribe({
        next: () => {
          trip.isFeatured = featured ? 'true' : 'false';
          this.uiToast.showToast(
            featured ? 'Trip featured!' : 'Trip unfeatured!',
            1500,
            featured ? 'success' : 'medium'
          );
           this.tripService.updateTripFeature(trip.id!, featured);
        },
        error: () =>
          this.uiToast.showToast('Failed to update feature', 1500, 'danger'),
      });
  }

  // Logout
  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Logout', handler: () => this.logout() },
      ],
    });
    await alert.present();
  }

  logout() {
    this.auth.logout();
    this.uiToast.showToast('Logged out successfully', 1500, 'medium');
  }

  goToManageDestinations() {
    this.router.navigateByUrl('/admin/manage-destinations');
  }
}
