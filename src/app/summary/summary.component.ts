import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from '../services/summary/summary.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import {
  START_USING_DATE,
  USERNAME,
  AVATAR_CODE
} from '../services/local-storage/local-storage.namespace';
import { getTodayTime, ONE_DAY } from '../../utils/time';
import { pageSwitchTransition } from './summary.animation';


@Component({
  selector   : 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls  : [ './summary.component.less' ],
  animations : [ pageSwitchTransition ]
})
export class SummaryComponent implements OnInit {
  avatar = this.store.get(AVATAR_CODE);
  username = this.store.get(USERNAME) || 'username';
  dateCount = (getTodayTime() - this.store.get(START_USING_DATE)) / ONE_DAY + 1;

  @HostBinding('@pageSwitchTransition') private state = 'activated';

  constructor(
    private summaryService: SummaryService,
    private store: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  requestForDate(date: Date | number): string {
    const summary = this.summaryService.summaryForDate(date);
    return summary ? summary._id : '';
  }

  requestForMonth(month: Date | number): void { }

  goBack(): void {
    this.router.navigateByUrl('/main');
  }
}
