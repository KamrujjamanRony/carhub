import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ECommerceUser`;

  addUser(model: any): Observable<any> {
    return this.http.post(this.apiUrl, model,
      { responseType: 'text' })
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`)
  }

  getUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: any, updateRequest: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updateRequest,
      { responseType: 'text' });
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
