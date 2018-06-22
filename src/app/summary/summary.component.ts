import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from '../services/summary/summary.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import {
  START_USING_DATE,
  USERNAME
} from '../services/local-storage/local-storage.namespace';
import { getTodayTime, ONE_DAY } from '../../utils/time';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent implements OnInit {
  private username = this.store.get(USERNAME) || 'username';
  private dateCount =
    (getTodayTime() - this.store.get(START_USING_DATE)) / ONE_DAY + 1;

  constructor(
    private summaryService: SummaryService,
    private store: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {}

  private requestForDate(date: Date | number): string {
    const summary = this.summaryService.summaryForDate(date);
    return summary ? summary._id : '';
  }

  private requestForMonth(month: Date | number): void {}

  private goBack(): void {
    this.router.navigateByUrl('/main');
  }
}
