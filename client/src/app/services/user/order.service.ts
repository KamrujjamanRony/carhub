import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/Orders`;

    constructor(private http: HttpClient) { }

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, order);
    }

    getAllOrders(reqBody?: any, status?: any): Observable<any[]> {
        // Add status to request body only if it's provided
        if (status !== undefined && status !== null && status !== 'null') {
            reqBody.orderStatus = status;
        }
        return this.http.post<any[]>(`${this.apiUrl}/searchOrder`, reqBody);
    }

    getOrdersByUser(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
    }

    getOrderById(orderId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/order/${orderId}`);
    }

    updateOrderStatus(id: string, orderStatus: any): Observable<any> {
        // Prepare update data
        const updateRequest: Partial<any> = { orderStatus };
        if (orderStatus == 'Delivered' || orderStatus == 3) {
            updateRequest['deliveredDate'] = new Date().toISOString();
        }
        return this.http.put<any>(`${this.apiUrl}/status/${id}`, updateRequest);
    }

    updateOrder(id: string, updateRequest: Partial<any>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, updateRequest);
    }

    deleteOrder(id: string): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }
}