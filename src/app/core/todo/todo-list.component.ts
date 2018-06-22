import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core';
import {
  NzDropdownService,
  NzDropdownContextComponent,
  NzMenuItemDirective
} from 'ng-zorro-antd';

import { Todo } from '../../../domain/entities';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() todoClick = new EventEmitter<string>();
  @Output() todoToggle = new EventEmitter<string>();
  @Output() todoDelete = new EventEmitter<string>();
  @Output() todoToday = new EventEmitter<string>();

  private dropdown: NzDropdownContextComponent;
  private currentContext = '';

  constructor(private dropdownService: NzDropdownService) {}

  ngOnInit() {}

  private handleToggleComplete(id: string): void {
    this.todoToggle.next(id);
  }

  private contextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    uuid: string
  ): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContext = uuid;
  }

  private delete(): void {
    this.todoDelete.next(this.currentContext);
    this.currentContext = '';
  }

  private setToday(): void {
    this.todoToday.next(this.currentContext);
    this.currentContext = '';
  }

  private close(e: NzMenuItemDirective): void {
    this.dropdown.close();
  }
}
