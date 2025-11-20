import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UIToastService } from 'src/app/core/service/ui.service';
 // ✅ use your global toast service

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private uiToast = inject(UIToastService); // reusable toast service

  username = '';
  password = '';
  isLoading = false;

  login() {
    if (!this.username || !this.password) {
      this.uiToast.showToast('Please enter both username and password', 2000, 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.token) {
          this.authService.saveSession(res.token, res.role!);
          this.uiToast.showToast('Login successful!', 2000, 'success');
          this.authService.redirectAfterLogin(res.role);
        } else {
          this.uiToast.showToast(res.message || 'Login failed', 2000, 'danger');
        }
      },
      error: (err: unknown) => {
        this.isLoading = false;

        // Type-safe error message extraction
        const message =
          err instanceof Error
            ? err.message
            : 'Invalid credentials. Please try again.';

        this.uiToast.showToast(message, 2000, 'danger');
      },
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
