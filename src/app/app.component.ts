import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { floorToDate } from '../utils/time';
import { SummaryService } from './services/summary/summary.service';
import {
  START_USING_DATE,
  INIT_FLAG
} from './services/local-storage/local-storage.namespace';

/**
 * We are going to write app lifecycle methods here.
 * Be aware that app destorying lifecycle hooks are not reliable.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: LocalStorageService,
    private summaryService: SummaryService
  ) {}

  ngOnInit() {
    // App initializaiton.
    this.summaryService.doSummary();
  }
}
