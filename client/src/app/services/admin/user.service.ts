import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/User`;

  addUser(model: any): Observable<void> {
    return this.http.post<void>(this.apiUrl, model)
  }

  getUser(query: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SearchUser?Search=${query}`, {});
  }

  updateUser(id: string | number, updateUserRequest: any): Observable<any> {
    const req = {
      ...updateUserRequest,
      userId: id
    }
    return this.http.put<any>(`${this.apiUrl}/EditUser/${id}?userId=${id}`, req);
  }

  deleteUser(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteUser?id=${id}`);
  }
}
