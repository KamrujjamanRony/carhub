import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { AuthCookieService } from './auth-cookie.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  authCookieService = inject(AuthCookieService);
  router = inject(Router);
  public currentUser: any = null;

  getUser(data: any) {
    this.auth.onAuthStateChanged((user) => {
      data = user;
    });
  }

  isLoggedIn(): boolean {
    const user = this.authCookieService.getUserData();
    return !!user;
    // return !!this.auth.currentUser;
  }

  registerWithEmail(email: any, password: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInWithEmail(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  logout() {
    this.authCookieService.logout();
    this.router.navigate(['/']);
    return signOut(this.auth);
  }
  
}
