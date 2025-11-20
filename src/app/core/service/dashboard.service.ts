import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalTrips: number;
  approvedTrips: number;
  pendingTrips: number;
  rejectedTrips: number;
  featuredTrips: number;
  totalUsers?: number;
  tripsByCategory?: { [category: string]: number }; // optional map
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/dashboard`;

  // user-specific stats
  getUserStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/user`);
  }

  // admin stats (if needed)
  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/admin`);
  }
}
