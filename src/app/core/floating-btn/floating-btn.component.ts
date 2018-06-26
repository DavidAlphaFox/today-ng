import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-floating-btn',
  templateUrl: './floating-btn.component.html',
  styleUrls: ['./floating-btn.component.css']
})
export class FloatingBtnComponent implements OnInit {
  @Output() click = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  handleClick(e: MouseEvent): void {
    this.click.next(e);
  }

}
