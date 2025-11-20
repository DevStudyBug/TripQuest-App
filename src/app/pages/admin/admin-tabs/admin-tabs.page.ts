import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { earthOutline, mapOutline, barChartOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-admin-tabs',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './admin-tabs.page.html',
  styleUrls: ['./admin-tabs.page.scss'],
})
export class AdminTabsPage {
  private authService = inject(AuthService);

  constructor() {
    addIcons({ earthOutline, mapOutline, barChartOutline, logOutOutline });
  }

  logout() {
    this.authService.logout();
  }
}
