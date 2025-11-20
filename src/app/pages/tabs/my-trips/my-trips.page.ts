import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TripService } from 'src/app/core/service/trip.service';

import { addIcons } from 'ionicons';
import { createOutline, trashOutline, addOutline } from 'ionicons/icons';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Trip } from 'src/app/models/trip.mode';
import { TripFormModal } from './trip-form/trip-form.component';

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './my-trips.page.html',
  styleUrls: ['./my-trips.page.scss'],
})
export class MyTripsPage implements OnInit {
  private tripService = inject(TripService);
  private uiToast = inject(UIToastService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  trips: Trip[] = [];
  isLoading = false;

  constructor() {
    addIcons({ createOutline, trashOutline, addOutline });
  }

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading = true;
    this.tripService.getMyTrips().subscribe({
      next: (data) => {
        this.trips = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.uiToast.showToast('Failed to load trips', 2000, 'danger');
      },
    });
  }

  async openAddTrip() {
    const modal = await this.modalCtrl.create({
      component: TripFormModal,
    });
    modal.onDidDismiss().then((res) => {
      if (res.role === 'saved') this.loadTrips();
    });
    await modal.present();
  }

  async openEditTrip(trip: Trip) {
    const modal = await this.modalCtrl.create({
      component: TripFormModal,
      componentProps: { trip },
    });
    modal.onDidDismiss().then((res) => {
      if (res.role === 'saved') this.loadTrips();
    });
    await modal.present();
  }

  async confirmDelete(id?: number) {
  if (!id) return; // guard clause
  const alert = await this.alertCtrl.create({
    header: 'Delete Trip',
    message: 'Are you sure you want to delete this trip?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => this.deleteTrip(id),
      },
    ],
  });
  await alert.present();
}

  deleteTrip(id: number) {
    this.tripService.deleteTrip(id).subscribe({
      next: () => {
        this.trips = this.trips.filter(t => t.id !== id); // ✅ instant UI refresh
        this.uiToast.showToast('Trip deleted successfully', 1500, 'success');
      },
      error: () => this.uiToast.showToast('Failed to delete trip', 1500, 'danger'),
    });
  }
}