import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  NzDropdownService,
  NzDropdownContextComponent
} from 'ng-zorro-antd';

import { Todo, List } from '../../../domain/entities';
import { TodoService } from '../../services/todo/todo.service';
import { ListService } from '../../services/list/list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: [ './todo-list.component.css' ]
})
export class TodoListComponent implements OnInit, OnDestroy {
  @Input() todos: Todo[] = [];
  @Output() todoClick = new EventEmitter<string>();
  @Output() todoToggle = new EventEmitter<string>();
  @Output() todoDelete = new EventEmitter<string>();
  @Output() todoToday = new EventEmitter<string>();

  private dropdown: NzDropdownContextComponent;
  private currentContext: Todo;
  private list$: Subscription;
  innerLists: List[] = [];

  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzDropdownService
  ) { }

  listsExcept(listUUID: string): List[] {
    return this.innerLists.filter(l => l._id !== listUUID);
  }

  ngOnInit() {
    this.list$ = this.listService
      .getSubject()
      .subscribe((lists) => this.innerLists = [].concat(lists));
  }

  ngOnDestroy() {
    this.list$.unsubscribe();
  }

  toggle(id: string): void {
    this.todoToggle.next(id);
  }

  contextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    uuid: string
  ): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContext = this.todos.find(t => t._id === uuid);
    console.log(this.currentContext);
  }

  delete(): void {
    this.todoDelete.next(this.currentContext._id);
  }

  setToday(): void {
    this.todoToday.next(this.currentContext._id);
  }

  moveToList(listUUID: string): void {
    this.todoService.removeToList(this.currentContext._id, listUUID);
  }

  close(): void {
    this.dropdown.close();
  }
}
