import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Brand`;

  addBrand(model: any): Observable<any> {
    return this.http.post<void>(this.apiUrl, model)
  }

  getBrand(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`)
  }

  updateBrand(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateRequest);
  }

  deleteBrand(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
