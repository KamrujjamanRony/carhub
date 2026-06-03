import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Menu`;

  addMenu(model: any): Observable<any> {
    return this.http.post<void>(this.apiUrl, model)
  }

  getAllMenu(): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/SearchMenu`, {})
  }

  getMenu(id: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/GetById/${id}`, {})
  }

  updateMenu(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/EditMenu/${id}`, updateRequest);
  }

  deleteMenu(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteMenu?id=${id}`);
  }

  generateTreeData(userId: any = ''): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GenerateTreeData?userId=${userId}`);
  }
}
