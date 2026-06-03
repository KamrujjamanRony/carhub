import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  imports: [RouterLink],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})
export class UserSidebarComponent {
  private auth = inject(Auth);
  user: any;

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      // console.log(user)
    });
  }

}
