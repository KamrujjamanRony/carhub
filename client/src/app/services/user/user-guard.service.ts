import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuardService {
  canActivate(): boolean {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      return false;
    }
  }
}
