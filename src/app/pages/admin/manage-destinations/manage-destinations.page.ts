import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UIToastService } from 'src/app/core/service/ui.service';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { EditDestinationModal } from './edit-destination.modal/edit-destination.modal.component';


@Component({
  selector: 'app-manage-destinations',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './manage-destinations.page.html',
  styleUrls: ['./manage-destinations.page.scss'],
})
export class ManageDestinationsPage implements OnInit {
  private http = inject(HttpClient);
  private uiToast = inject(UIToastService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  destinations: any[] = [];
  categories = ['Beach', 'Mountain', 'City', 'Adventure', 'Spiritual', 'Historical', 'Other'];

  newDestination = {
    name: '',
    country: '',
    category: '',
    description: '',
    lat: null as number | null,
    lng: null as number | null,
  };

  private apiUrl = `${environment.apiBaseUrl}/destinations`;

  ngOnInit() {
    this.loadDestinations();
  }

  loadDestinations() {
    this.http.get(this.apiUrl).subscribe({
      next: (res: any) => (this.destinations = res),
      error: () => this.uiToast.showToast('Failed to load destinations', 2000, 'danger'),
    });
  }

  async grabLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.newDestination.lat = pos.coords.latitude;
      this.newDestination.lng = pos.coords.longitude;
      this.uiToast.showToast('📍 Location captured successfully!', 1500, 'success');
    } catch (err) {
      console.error(err);
      this.uiToast.showToast('Unable to fetch location', 2000, 'danger');
    }
  }

  addDestination() {
    if (!this.newDestination.name || !this.newDestination.country) {
      this.uiToast.showToast('Please fill all required fields', 1500, 'warning');
      return;
    }

    this.http.post(this.apiUrl, this.newDestination).subscribe({
      next: () => {
        this.uiToast.showToast('Destination added!', 1500, 'success');
        this.loadDestinations();
        this.newDestination = { name: '', country: '', category: '', description: '', lat: null, lng: null };
      },
      error: () => this.uiToast.showToast('Failed to add destination', 1500, 'danger'),
    });
  }

  async openEditModal(dest: any, slidingItem: any) {
    await slidingItem.close();

    const modal = await this.modalCtrl.create({
      component: EditDestinationModal,
      componentProps: { destination: { ...dest } },
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'updated') {
      this.updateDestination(data);
    }
  }

  updateDestination(dest: any) {
    this.http.put(`${this.apiUrl}/${dest.id}`, dest).subscribe({
      next: () => {
        this.uiToast.showToast('Destination updated!', 1500, 'success');
        this.loadDestinations();
      },
      error: () => this.uiToast.showToast('Failed to update destination', 1500, 'danger'),
    });
  }

  async confirmDelete(id: number, slidingItem: any) {
    await slidingItem.close();

    const alert = await this.alertCtrl.create({
      header: 'Delete Destination',
      message: 'Are you sure you want to delete this destination?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteDestination(id),
        },
      ],
    });
    await alert.present();
  }

  deleteDestination(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.uiToast.showToast('Deleted successfully', 1500, 'success');
        this.loadDestinations();
      },
      error: () => this.uiToast.showToast('Failed to delete', 1500, 'danger'),
    });
  }
}
