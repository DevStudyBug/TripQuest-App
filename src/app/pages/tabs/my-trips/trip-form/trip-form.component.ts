import { Component, Input, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from 'src/app/core/service/trip.service';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Trip } from 'src/app/models/trip.mode';

@Component({
  selector: 'app-trip-form-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss'],
})
export class TripFormModal {
  private modalCtrl = inject(ModalController);
  private tripService = inject(TripService);
  private uiToast = inject(UIToastService);

  @Input() trip?: Trip; // Edit mode input
  formData: Partial<Trip> = {};

  ngOnInit() {
    if (this.trip) {
      this.formData = { ...this.trip };

      // Convert backend date format to ISO for ion-datetime
      if (this.trip.startDate)
        this.formData.startDate = new Date(this.trip.startDate).toISOString();
      if (this.trip.endDate)
        this.formData.endDate = new Date(this.trip.endDate).toISOString();
    }
  }
  

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (!this.formData.title || !this.formData.destination || !this.formData.caption) {
      this.uiToast.showToast('Please fill all required fields', 1500, 'warning');
      return;
    }

    // ✅ Validate endDate >= startDate
    if (this.formData.startDate && this.formData.endDate) {
      const start = new Date(this.formData.startDate);
      const end = new Date(this.formData.endDate);
      if (end < start) {
        this.uiToast.showToast('End date cannot be before start date', 2000, 'danger');
        return;
      }
    }

    // ✅ Convert ISO → yyyy-MM-dd before sending to backend
    const payload = { ...this.formData };
    if (payload.startDate)
      payload.startDate = (payload.startDate as string).substring(0, 10);
    if (payload.endDate)
      payload.endDate = (payload.endDate as string).substring(0, 10);

    const request$ = this.trip
      ? this.tripService.updateTrip(this.trip.id!, payload)
      : this.tripService.createTrip(payload as Trip);

    request$.subscribe({
      next: (res) => {
        this.uiToast.showToast(
          this.trip ? 'Trip updated successfully!' : 'Trip added successfully!',
          1500,
          'success'
        );
        this.modalCtrl.dismiss(res, 'saved');
      },
      error: () => this.uiToast.showToast('Failed to save trip', 1500, 'danger'),
    });
  }
}
