import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../../services/user/users.service';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../components/primeng/toast/toast.service';

@Component({
    selector: 'app-profile-info',
    imports: [FormsModule],
    templateUrl: './profile-info.component.html',
    styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
    private usersService = inject(UsersService);
    private toastService = inject(ToastService);
    private auth = inject(Auth);
    userId: any;
    id: any;
    loading = signal<boolean>(false);
    model: any = {
        userId: "",
        email: "",
        username: "",
        role: "user",
        fullname: "",
        photoURL: "",
        address: [],
        gender: "",
        dob: "",
        phoneNumber: ""
    };

    ngOnInit() {
        this.auth.onAuthStateChanged((user) => {
            this.userId = user?.uid;
            this.fetchUser();
        });
    }

    fetchUser() {
        this.usersService.getUser(this.userId).subscribe(data => {
            this.model = data;
            this.id = data?.id;
        });
    }

    onFormSubmit() {
        const { fullname, username } = this.model;
        this.loading.set(true);
        if (fullname && username) {
            this.usersService.updateUser(this.model.id || this.id, this.model).subscribe({
                next: (response) => {
                    this.toastService.showMessage('success', 'Success', 'Profile Update successfully');
                    this.id = null;
                    setTimeout(() => {
                        this.loading.set(false);
                    }, 1500);
                },
                error: (error) => {
                    this.toastService.showMessage('error', 'Error', error.error.message);
                    console.error('Error Update Profile:', error.error);
                    setTimeout(() => {
                        this.loading.set(false);
                    }, 1500);
                }
            });
        } else {
            this.toastService.showMessage('warn', 'Warning', 'All Fields are required!');
            setTimeout(() => {
                this.loading.set(false);
            }, 1500);
        }

    }

}
