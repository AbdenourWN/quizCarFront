import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageSub = new BehaviorSubject<string | null>(null);
  private tokenKey = 'token'; // Key under which the token is stored

  constructor() {}

  // Observable to watch for changes in the token
  watchToken(): Observable<string | null> {
    return this.storageSub.asObservable();
  }

  // Save the token to localStorage and emit an event
  setToken(token: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.tokenKey, token);
      this.storageSub.next(token);
    }
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
      this.storageSub.next(localStorage.getItem(this.tokenKey));
      return localStorage.getItem(this.tokenKey);
  }

  // Remove the token from localStorage and emit an event
  removeToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      this.storageSub.next(null);
    }
  }

  // Clear all localStorage items and emit an event
  clearStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      this.storageSub.next(null);
    }
  }
}
