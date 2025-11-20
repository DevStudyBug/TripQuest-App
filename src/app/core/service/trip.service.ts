import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Trip } from 'src/app/models/trip.mode';

@Injectable({ providedIn: 'root' })
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/trips`;

  /**  BehaviorSubject for live feed updates */
  private feedSubject = new BehaviorSubject<Trip[]>([]);
  feed$ = this.feedSubject.asObservable();

  /**  Load all approved trips for Explore/Feed page */
  loadFeed(): void {
    this.http.get<Trip[]>(`${this.apiUrl}/feed`).subscribe({
      next: (res) => {
        const approvedTrips = res.filter((t) => t.status === 'APPROVED');
        this.feedSubject.next(approvedTrips);
      },
      error: (err) => {
        console.error('Failed to load feed', err);
      },
    });
  }

  /**  Get current live feed as Observable */
  getFeed(): Observable<Trip[]> {
    return this.feed$;
  }

  /** Get current snapshot (synchronously) */
  get currentFeed(): Trip[] {
    return this.feedSubject.value;
  }

  /**  Add new trip instantly to feed (for Admin approval updates) */
  addTripToFeed(trip: Trip): void {
    const updated = [trip, ...this.currentFeed];
    this.feedSubject.next(updated);
  }

  /**  Remove trip instantly from feed (for rejection updates) */
  removeTripFromFeed(id: number): void {
    const updated = this.currentFeed.filter((t) => t.id !== id);
    this.feedSubject.next(updated);
  }
/**  Toggle featured status instantly in feed */
updateTripFeature(id: number, isFeatured: boolean): void {
  const updatedFeed = this.currentFeed.map((trip) =>
    trip.id === id ? { ...trip, isFeatured: isFeatured ? 'true' : 'false' } : trip
  );
  this.feedSubject.next(updatedFeed);
}

  //  My Trips (for Traveller)
 getMyTrips() {
  return this.http.get<Trip[]>(`${this.apiUrl}/my-trips`);
}


  //  Create Trip
  createTrip(data: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, data);
  }

  //  Update Trip
  // ✅ Corrected method
updateTrip(id: number, data: Partial<Trip>): Observable<Trip> {
  return this.http.put<Trip>(`${this.apiUrl}/${id}`, data);
}


  //  Delete Trip
  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
