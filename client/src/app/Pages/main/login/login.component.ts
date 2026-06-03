
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { UsersService } from '../../../services/user/users.service';
import { AuthService } from '../../../services/user/auth.service';
import { Location } from '@angular/common';
import { ToastService } from '../../../components/primeng/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Form Init ------------------------------------------------------
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  // End Form Init ----------------------------------------------------------------

  // Declare Services ------------------------------------------------------
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private location = inject(Location);
  private authCookieService = inject(AuthCookieService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  error: any;


  onSubmit(e: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      // console.log(this.form.value);
      const { email, password } = this.form.value;
      this.authService
        .signInWithEmail(email, password)
        .then((data) => {
          this.authCookieService.login(data.user);
          this.entryUser(data.user);
          // console.log('Logged in successfully');
          this.location.back();
        })
        .catch((err) => {
          this.error = err.toString();
          // console.log('Login failed', err.toString());
        });
    } else {
      alert('Form is invalid! Please Fill Email and Password.');
    }
  }

  loginWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then((data) => {
        this.authCookieService.login(data.user);
        this.entryUser(data.user);
        // console.log('Logged in with Google');
        this.location.back();
      })
      .catch((err) => {
        this.error = err.toString();
        // console.log('Google login failed', err)
      });
  }

  loginWithFacebook() {
    this.authService
      .signInWithFacebook()
      .then((data) => {
        this.authCookieService.login(data.user);
        this.entryUser(data.user);
        // console.log('Logged in with Facebook');
        this.location.back();
      })
      .catch((err) => {
        this.error = err.toString();
        // console.log('Facebook login failed', err)
      });
  }

  entryUser(userData: any) {
    // console.log('Initial user data:', userData);

    if (!userData?.uid) {
      console.error('No UID provided in user data');
      return;
    }

    this.usersService.getUser(userData.uid).subscribe({
      next: (existingUser) => {
        if (existingUser?.userId) {
          // console.log('User already exists:', existingUser);
        } else {
          const providerData = userData.providerData?.[0] || {};
          const email = providerData.email || '';
          const username = email.split('@')[0] || 'user';

          const userInfo = {
            userId: userData.uid,
            email: email,
            username: username,
            role: "user",
            fullname: providerData.displayName || username,
            photoURL: providerData.photoURL || '',
            address: [],
            gender: "",
            dob: "1997-12-08",
            phoneNumber: providerData.phoneNumber || ''
          };

          // console.log('Creating new user:', userInfo);
          this.usersService.addUser(userInfo).subscribe({
            next: (createdUser) => {
              // console.log('User created successfully:', createdUser);
            },
            error: (err) => {
              console.error('Error creating user:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error checking for existing user:', err);
      }
    });
  }


  formReset(e: Event): void {
    e.preventDefault();
    this.form.reset({
      email: '',
      password: ''
    });
    this.isSubmitted = false;
  }
}
