import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UIToastService } from 'src/app/core/service/ui.service';
 // ✅ import your custom toast service

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private uiToast = inject(UIToastService); // ✅ use your reusable toast service

  username = '';
  email = '';
  password = '';
  isLoading = false;

  register() {
    if (!this.username || !this.email || !this.password) {
      this.uiToast.showToast('Please fill all fields', 2000, 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        this.uiToast.showToast(res.message || 'Registration successful!', 2000, 'success');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: (err: unknown) => {
        this.isLoading = false;

        // ✅ Fix: Properly handle 'unknown' type
        const message =
          err instanceof Error
            ? err.message
            : 'Registration failed. Please try again.';

        this.uiToast.showToast(message, 2000, 'danger');
      },
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
