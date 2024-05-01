import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ContactusService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  sendContactMessage(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/contact-us-email`, data);
  }
}
