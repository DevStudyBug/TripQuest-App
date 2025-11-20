import { Component, Input, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Trip } from 'src/app/models/trip.mode';

@Component({
  selector: 'app-trip-report-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './trip-report-modal.component.html',
  styleUrls: ['./trip-report-modal.component.scss'],
})
export class TripReportModalComponent {
  private modalCtrl = inject(ModalController);

  @Input() trip!: Trip;

  close() {
    this.modalCtrl.dismiss(null, 'close');
  }

  approveAgain() {
    this.modalCtrl.dismiss(this.trip, 'approve');
  }
}
