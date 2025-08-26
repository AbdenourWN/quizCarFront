import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageSub: BehaviorSubject<string | null>;
  private readonly tokenKey = 'token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize the BehaviorSubject with the token ONLY if in the browser
    const initialToken = this.getTokenFromStorage();
    this.storageSub = new BehaviorSubject<string | null>(initialToken);
  }

  // --- PRIVATE HELPER ---
  // A safe, private method to get the token from storage
  private getTokenFromStorage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // --- PUBLIC API ---

  // Observable to watch for changes in the token
  watchToken(): Observable<string | null> {
    return this.storageSub.asObservable();
  }

  // Save the token to localStorage and emit an event
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.storageSub.next(token);
    }
  }

  // Retrieve the token from localStorage (now SSR-safe)
  getToken(): string | null {
    // This now safely returns the value from our private helper
    return this.getTokenFromStorage();
  }

  // Remove the token from localStorage and emit an event
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.storageSub.next(null);
    }
  }

  // Clear all localStorage items and emit an event
  clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.storageSub.next(null);
    }
  }
}