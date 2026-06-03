import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/user/auth.service';
import { ToastService } from '../../../components/primeng/toast/toast.service';

@Component({
  selector: 'app-password-reset',
  imports: [CommonModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  isLoading: boolean = false;
  resetSent: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  resetPassword() {
    if (!this.email) {
      this.toastService.showMessage('error', 'Error', 'Please enter your email address');
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.email)
      .then(() => {
        this.resetSent = true;
        this.toastService.showMessage('success', 'Success', 'Password reset email sent. Please check your inbox.');
      })
      .catch(error => {
        let errorMessage = 'Failed to send reset email';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No user found with this email address';
        }
        this.toastService.showMessage('error', 'Error', errorMessage);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}