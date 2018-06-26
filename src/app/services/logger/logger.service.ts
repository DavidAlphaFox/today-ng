import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  message(...args): void {
    if (!environment.production) { console.log(...args); }
  }
}
