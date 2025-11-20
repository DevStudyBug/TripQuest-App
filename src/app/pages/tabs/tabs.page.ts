import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  airplaneOutline,
  compassOutline,
  statsChartOutline,
  personOutline,
  logOutOutline
} from 'ionicons/icons';

import { AuthService } from 'src/app/core/auth/auth.service';
import { UIToastService } from 'src/app/core/service/ui.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  private authService = inject(AuthService);
  private uiToast = inject(UIToastService);
  private router = inject(Router);

  constructor() {
    // ✅ Register all the icons you plan to use here
    addIcons({
      homeOutline,
      airplaneOutline,
      compassOutline,
      statsChartOutline,
      personOutline,
      logOutOutline
    });
  }

  async logout() {
    this.authService.logout();
    await this.uiToast.showToast('Logged out successfully', 1500, 'medium');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
