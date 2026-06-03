// product.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Product`;

  addProduct(model: any | FormData): Observable<void> {
    return this.http.post<void>(this.apiUrl, model);
  }

  getProducts(query: string = '', category: string = '', brand: string = ''): Observable<any[]> {
    const queryParams = {
      search: query,
      category: category,
      brand: brand
    }
    return this.http.post<any[]>(`${this.apiUrl}/search`, queryParams);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, updateProductRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateProductRequest);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getRelatedProducts(productId: number): Observable<any[]> {
    return this.getProducts().pipe(
      map(products => {
        const mainProduct = products.find(p => p.id === productId);
        if (!mainProduct?.relatedProducts) return [];
        return products.filter(p =>
          mainProduct.relatedProducts.includes(p.id) &&
          p.id !== productId
        );
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }
}