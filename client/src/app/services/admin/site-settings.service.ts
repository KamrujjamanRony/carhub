import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSettingsById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/SiteSetting/${id}`);
  }

  createSiteSettings(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/SiteSetting`, data);
  }

  updateSiteSettings(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseURL}/SiteSetting/${id}`, data);
  }

  deleteSiteSettings(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/SiteSetting/${id}`);
  }
}