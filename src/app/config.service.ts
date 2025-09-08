import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private configUrl = 'assets/config.json';
  private config$: Observable<any>;

  constructor(private http: HttpClient) {
    this.config$ = this.http.get<any>(this.configUrl).pipe(shareReplay(1));
  }

  get messages(): Observable<any> {
    return this.config$.pipe();
  }
}