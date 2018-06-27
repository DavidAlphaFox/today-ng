import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector   : 'app-quick-add',
  templateUrl: './quick-add.component.html',
  styleUrls  : [ './quick-add.component.less' ]
})
export class QuickAddComponent implements OnInit {
  @ViewChild('addInput') private input: ElementRef;
  @Output() add = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addTodo(title: string) {
    const inputEl = this.input.nativeElement as HTMLElement;
    inputEl.scrollIntoView();

    // this.input.nativeElement.scrollTo(0, 0);
    if (title) { this.add.next(title); }
  }

}
