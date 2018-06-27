import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoListComponent } from './todo/todo-list.component';

@Component({
  selector   : 'app-right-control',
  templateUrl: './right-control.component.html',
  styleUrls  : [ './right-control.component.less' ]
})
export class RightControlComponent implements OnInit {

  @ViewChild(TodoListComponent) private todoList: TodoListComponent;

  constructor() { }

  ngOnInit() {
  }

  add(title: string) {
    this.todoList.add(title);
  }

}
