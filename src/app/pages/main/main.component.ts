import { Component, OnInit, HostBinding } from '@angular/core';
import { mainPageSwitchTransition } from './main.animation';


@Component({
  selector   : 'app-core',
  templateUrl: './main.component.html',
  styleUrls  : [ './main.component.less' ],
  animations : [ mainPageSwitchTransition ]
})
export class MainComponent implements OnInit {
  isCollapsed = false;

  @HostBinding('@mainPageSwitchTransition') state = 'activated';

  constructor() { }

  ngOnInit() { }
}
