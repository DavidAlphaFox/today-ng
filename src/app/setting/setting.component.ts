import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../services/summary/summary.service';
import { Summary } from '../../domain/entities';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: [ './setting.component.css' ]
})
export class SettingComponent implements OnInit {
  private innerSummaries: Summary[] = [];

  constructor(private summaryService: SummaryService) { }

  ngOnInit() {
    this.summaryService.doSummary();
  }

  private requestSummary(date: Date | number): void {
    this.summaryService.doSummary();
  }
}
