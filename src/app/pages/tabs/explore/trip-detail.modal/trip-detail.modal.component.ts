import { Component, Input, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UIToastService } from 'src/app/core/service/ui.service';
import { TripService } from 'src/app/core/service/trip.service';
import { Trip } from 'src/app/models/trip.mode';


@Component({
  selector: 'app-trip-detail-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './trip-detail.modal.component.html',
  styleUrls: ['./trip-detail.modal.component.scss'],
})
export class TripDetailModalComponent {
  @Input() trip!: Trip;

  private modalCtrl = inject(ModalController);
  private tripService = inject(TripService);
  private uiToast = inject(UIToastService);

  close() {
    this.modalCtrl.dismiss();
  }

  planSimilarTrip() {
    if (!this.trip) return;

    const newTrip = {
      ...this.trip,
      id: undefined,
      status: 'PENDING_APPROVAL',
      isFeatured: 'false',
    };

    this.tripService.createTrip(newTrip).subscribe({
      next: () => {
        this.uiToast.showToast('Trip added to My Trips for approval', 2000, 'success');
        this.modalCtrl.dismiss({ refresh: true });
      },
      error: () => {
        this.uiToast.showToast('Failed to plan trip', 2000, 'danger');
      },
    });
  }
}
