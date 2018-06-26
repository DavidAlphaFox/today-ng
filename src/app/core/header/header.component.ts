import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RankBy } from '../../../domain/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.less' ]
})
export class HeaderComponent implements OnInit {
  @Input() listTitle: string;
  @Output() rankerChange = new EventEmitter<RankBy>();

  constructor() { }

  ngOnInit() {
  }

  switchRankType(e: RankBy): void {
    this.rankerChange.emit(e);
  }
}
