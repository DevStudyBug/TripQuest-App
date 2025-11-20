import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UIToastService } from 'src/app/core/service/ui.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private ui = inject(UIToastService);
  private alertCtrl = inject(AlertController);

  user: any = { username: '', email: '', role: '' };
  isLoading = false;
  isEditing = false;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.http.get(`${environment.apiBaseUrl}/auth/me`).subscribe({
      next: (data: any) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.ui.showToast('Failed to load profile', 1500, 'danger');
        this.isLoading = false;
      },
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveChanges() {
    this.http.patch(`${environment.apiBaseUrl}/auth/me`, this.user).subscribe({
      next: () => {
        this.ui.showToast('Profile updated successfully', 1500, 'success');
        this.isEditing = false;
      },
      error: () => this.ui.showToast('Failed to update profile', 1500, 'danger'),
    });
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout',
          handler: () => {
            this.auth.logout();
            this.ui.showToast('Logged out successfully', 1000, 'success');
          },
        },
      ],
    });
    await alert.present();
  }
}
