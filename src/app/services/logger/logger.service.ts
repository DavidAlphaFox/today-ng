import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class LoggerService {
  private isDevMode = isDevMode();

  constructor() { }

  log(msg: string): void {
  }
}
