import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Category`;

  addCategory(model: any): Observable<any> {
    return this.http.post<void>(this.apiUrl, model)
  }

  getCategory(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`)
  }

  updateCategory(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateRequest);
  }

  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
