import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TripService } from 'src/app/core/service/trip.service';
import { UIToastService } from 'src/app/core/service/ui.service';
import { TripDetailModalComponent } from './trip-detail.modal/trip-detail.modal.component';
import { Trip } from 'src/app/models/trip.mode';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  private tripService = inject(TripService);
  private modalCtrl = inject(ModalController);
  private uiToast = inject(UIToastService);

  trips: Trip[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading = true;
    this.tripService.getFeed().subscribe({
      next: (res) => {
        this.trips = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.uiToast.showToast('Failed to load trips', 2000, 'danger');
      },
    });
  }

  async openTripDetail(trip: Trip) {
    const modal = await this.modalCtrl.create({
      component: TripDetailModalComponent,
      componentProps: { trip },
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) this.loadTrips();
    });

    await modal.present();
  }
}
