import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
  selector: 'app-edit-destination-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonLabel,
  ],
  templateUrl: './edit-destination.modal.component.html',
  styleUrls: ['./edit-destination.modal.component.scss'],
})
export class EditDestinationModal implements OnInit, OnDestroy {
  @Input() destination: any;
  private modalCtrl = inject(ModalController);
  private uiToast = inject(UIToastService);

  map: GoogleMap | null = null;

  async ngOnInit() {
    // Slight delay ensures the modal and map container are rendered
    setTimeout(() => this.loadGoogleMap(), 500);
  }

  async ngOnDestroy() {
    if (this.map) {
      await this.map.destroy();
      this.map = null;
    }
  }

  /**  Capture Location using Capacitor Geolocation */
  async grabLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.destination.lat = pos.coords.latitude;
      this.destination.lng = pos.coords.longitude;
      this.uiToast.showToast('📍 Location updated successfully!', 1500, 'success');

      // Reload map after updating coordinates
      this.loadGoogleMap();
    } catch (error) {
      console.error('❌ Geolocation error:', error);
      this.uiToast.showToast('Failed to fetch location', 2000, 'danger');
    }
  }

  /** Load Google Map (auto fallback for web) */
  async loadGoogleMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || !this.destination?.lat || !this.destination?.lng) return;

    //  Fallback: Web browser
    if (Capacitor.getPlatform() === 'web') {
      this.initializeWebMap(mapDiv);
      return;
    }

    // Native Google Maps (Android/iOS)
    try {
      if (this.map) {
        await this.map.destroy();
      }

      this.map = await GoogleMap.create({
        id: 'destination-map',
        element: mapDiv,
        apiKey: 'AIzaSyB0QMpsgHjavlbzJshLAHRVrzDHZ6p7DlM', // use your key
        config: {
          center: {
            lat: this.destination.lat,
            lng: this.destination.lng,
          },
          zoom: 14,
        },
      });

      await this.map.addMarker({
        coordinate: {
          lat: this.destination.lat,
          lng: this.destination.lng,
        },
        title: this.destination.name || 'Destination',
      });
    } catch (error) {
      console.warn('⚠️ Native map not available — falling back to web map.');
      this.initializeWebMap(mapDiv);
    }
  }

  /** Web Google Maps SDK fallback */
  private initializeWebMap(mapDiv: HTMLElement) {
    // Load Google Maps JS SDK if not already loaded
    if (!(window as any).google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB0QMpsgHjavlbzJshLAHRVrzDHZ6p7DlM`;
      document.head.appendChild(script);
      script.onload = () => this.renderWebMap(mapDiv);
    } else {
      this.renderWebMap(mapDiv);
    }
  }

  private renderWebMap(mapDiv: HTMLElement) {
    const gmap = new google.maps.Map(mapDiv, {
      center: { lat: this.destination.lat, lng: this.destination.lng },
      zoom: 14,
    });

    new google.maps.Marker({
      position: { lat: this.destination.lat, lng: this.destination.lng },
      map: gmap,
      title: this.destination.name,
      draggable: true,
    });
  }

  /* Save destination changes */
  saveChanges() {
    this.modalCtrl.dismiss(this.destination, 'updated');
  }

  /* Cancel edit */
  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
