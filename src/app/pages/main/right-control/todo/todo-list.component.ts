import { Component, OnInit, TemplateRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { combineLatest, Subscription } from 'rxjs';
import { Todo, List } from '../../../../../domain/entities';
import { TodoService } from '../../../../services/todo/todo.service';
import { ListService } from '../../../../services/list/list.service';
import { floorToDate, getTodayTime } from '../../../../../utils/time';
import { RankBy } from '../../../../../domain/types';


const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1: Todo, t2: Todo) => t1.completedFlag && !t2.completedFlag;
  }
  return (t1: Todo, t2: Todo) => t1[ type ] > t2[ type ];
};


@Component({
  selector   : 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls  : [ './todo-list.component.less' ]
})
export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('todoInput') private todoInput: ElementRef;

  private dropdown: NzDropdownContextComponent;
  private todo$: Subscription;
  private list$: Subscription;

  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;
  addTodoModalVisible = false;

  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzDropdownService,
    private router: Router
  ) { }

  ngOnInit() {
    const listSource = this.listService.getSubject();
    const currentListUuidSource = this.listService.getCurrentListUuidSubject();
    const todoSource = this.todoService.getSubject();
    const rankSource = this.todoService.getRankSubject();

    this.list$ = listSource
      .subscribe(lists => {
        this.lists = lists;
      });

    this.todo$ = combineLatest(currentListUuidSource, todoSource, rankSource)
      .subscribe(sources => {
        this.processTodos(sources[ 0 ], sources[ 1 ], sources[ 2 ]);
      });

    this.todoService.getAll();
    this.listService.getAll();
  }

  ngOnDestroy() {
    this.list$.unsubscribe();
    this.todo$.unsubscribe();
  }

  private processTodos(listUUID: string, todos: Todo[], rank: RankBy): void {
    const filteredTodos = todos
      .filter(todo => {
        return ((listUUID === 'today' && todo.planAt && floorToDate(todo.planAt) <= getTodayTime())
          || (listUUID === 'todo' && (!todo.listUUID || todo.listUUID === 'todo'))
          || (listUUID === todo.listUUID));
      })
      .map(todo => Object.assign({}, todo))
      .sort(rankerGenerator(rank));

    this.todos = [].concat(filteredTodos);
  }

  listsExcept(listUUID: string): List[] {
    return this.lists.filter(l => l._id !== listUUID);
  }

  openAddTodoModal() {
    this.addTodoModalVisible = true;
    setTimeout(() => {
      this.todoInput.nativeElement.focus();
    });
  }

  closeAddTodoModal() {
    this.addTodoModalVisible = false;
  }

  click(uuid: string): void {
    this.router.navigateByUrl(`/main/${uuid}`);
  }

  contextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    uuid: string
  ): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContextTodo = this.todos.find(t => t._id === uuid);
  }

  add(title: string): void {
    this.todoService.add(title);
    this.closeAddTodoModal();
  }

  toggle(uuid: string): void {
    this.todoService.toggleTodoComplete(uuid);
  }

  delete(): void {
    this.todoService.delete(this.currentContextTodo._id);
  }

  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo._id);
  }

  moveToList(listUuid: string): void {
    this.todoService.moveToList(this.currentContextTodo._id, listUuid);
  }

  close(): void {
    this.dropdown.close();
  }
}
