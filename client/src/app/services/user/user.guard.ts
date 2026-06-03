import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthCookieService } from './auth-cookie.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthCookieService
  ) { }

  canActivate(): boolean {
    const userInfo = this.authService.getUserData();

    if (userInfo) {
      return true;
    }

    // this.location.back();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    return false;
  }
}