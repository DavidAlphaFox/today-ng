import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
import { TodoService } from '../services/todo/todo.service';
import { ListService } from '../services/list/list.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import {
  USERNAME,
  AVATAR_CODE,
  INIT_FLAG
} from '../services/local-storage/local-storage.namespace';
import { Todo, List } from '../../domain/entities';
import { floorToDate } from '../../utils/time';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: [ './core.component.less' ]
})
export class CoreComponent implements OnInit, OnDestroy {
  private isCollapsed = false;

  private todos$: Subscription;
  private lists$: Subscription;
  private sort$: Subscription;
  private filter$: Subscription;

  private innerTodos: Todo[] = [];
  private innerLists: List[] = [];
  private addTodoModalVisible = false;
  private addListModalVisible = false;
  private renameListModalVisible = false;
  private templateListUUID: string;
  private avatar = this.store.get(AVATAR_CODE);
  private username = this.store.get(USERNAME);

  @ViewChild('todoInput') private todoInput: ElementRef;
  @ViewChild('listRenameInput') private listRenameInput: ElementRef;
  @ViewChild('listInput') private listInput: ElementRef;

  constructor(
    private todoService: TodoService,
    private listService: ListService,
    private router: Router,
    private modal: NzModalService,
    private store: LocalStorageService
  ) { }

  private keyboard$: any;

  ngOnInit() {
    if (!this.store.get(INIT_FLAG)) { this.router.navigateByUrl('/setup'); return; }
    this.makeSubcriptions();
    // We have to bind this here. Otherwise, you know this would be bind to undefined.
    this.keyboard$ = this.keyboardHandler.bind(this);
    window.addEventListener('keydown', this.keyboard$);
  }

  ngOnDestroy() {
    if (this.lists$) { this.lists$.unsubscribe(); }
    if (this.todos$) { this.todos$.unsubscribe(); }
    window.removeEventListener('keydown', this.keyboard$);
  }

  private makeSubcriptions(): void {
    const listSource = this.listService.getSubject();

    this.lists$ = listSource.subscribe((lists: List[]) => {
      this.innerLists = [].concat(lists);
    });

    const currentUUIDSource = this.listService.getCurrentSubject();
    const todoSource = this.todoService.getSubject();
    const combined = currentUUIDSource.pipe(combineLatest(todoSource));

    this.todos$ = combined.subscribe(sources => {
      this.processTodos(sources[ 0 ], sources[ 1 ]);
    });

    this.listService.getAll();
    this.todoService.getAll();
  }

  private keyboardHandler(e: KeyboardEvent): void {
    // command+U to create a new list
    if (e.keyCode === 85 && (e.metaKey || e.ctrlKey)) {
      this.showAddListModal();
      return;
    }

    // command+I to create a new todo
    if (e.keyCode === 73 && (e.metaKey || e.ctrlKey)) {
      this.showAddTodoModal();
      return;
    }

    if (e.keyCode === 27) {
      this.closeAddListModal();
      this.closeAddTodoModal();
      this.closeRenameListModal();
    }
  }

  private processTodos(uuid: string, todos: Todo[]): void {
    const filteredTodos = todos
      .filter(todo => {
        if (
          uuid === 'today' &&
          todo.planAt &&
          floorToDate(todo.planAt) === floorToDate(new Date())
        ) { return true; }
        if (uuid === 'todo' && (!todo.listUUID || todo.listUUID === 'todo')) { return true; }
        if (uuid === todo.listUUID) { return true; }
        return false;
      })
      .map(todo => {
        // to avoid changing source of truth unexpectly
        // maybe we should introduce immutable-js to this project
        return Object.assign({}, todo);
      });

    this.innerTodos = [].concat(filteredTodos);
  }

  /* events on modals */
  private showAddTodoModal(): void {
    this.addTodoModalVisible = true;
    setTimeout(() => { this.todoInput.nativeElement.focus(); });
  }
  private closeAddTodoModal(): void {
    this.addTodoModalVisible = false;
  }
  private showAddListModal(): void {
    this.addListModalVisible = true;
    setTimeout(() => { this.listInput.nativeElement.focus(); });
  }
  private closeAddListModal(): void {
    this.addListModalVisible = false;
  }
  private showRenameListModal(uuid: string): void {
    this.renameListModalVisible = true;
    this.templateListUUID = uuid;
    setTimeout(() => {
      const title = this.innerLists.find(l => l._id === uuid).title;
      this.listRenameInput.nativeElement.value = title;
      this.listRenameInput.nativeElement.focus();
    });
  }
  private closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }

  /* events on lists */
  private handleAddListOk(title: string): void {
    if (title) { this.listService.add(title); }
    this.closeAddListModal();
  }
  private confirmDeleteList(uuid: string): void {
    const i = this.innerLists.findIndex(l => l._id === uuid);
    const list = this.innerLists[ i ];

    this.modal.confirm({
      nzTitle: '确认删除列表',
      nzContent: '该操作会导致该列表下的所有待办事项被删除',
      nzOnOk: () =>
        new Promise((res, rej) => {
          this.listService.delete(uuid);
          this.todoService.deleteInList(uuid);
          res();
        }).catch(() => console.error('Delete list failed'))
    });
  }
  private renameList(title: string): void {
    const list = this.innerLists.find(l => l._id === this.templateListUUID);
    list.title = title;
    this.listService.update(list);
    this.closeRenameListModal();
    this.templateListUUID = '';
  }
  private clickList(uuid: string): void {
    this.listService.setCurrentUUID(uuid);
  }

  /* events on todos */
  private handleAddTodoOk(title: string): void {
    if (title) {
      this.todoService.add(title);
    }
    this.closeAddTodoModal();
  }
  private handleTodoClick(uuid: string): void {
    this.router.navigateByUrl(`main/${uuid}`);
  }
  private deleteTodo(uuid: string): void {
    this.todoService.delete(uuid);
  }
  private setToday(uuid: string): void {
    this.todoService.setTodoToday(uuid);
  }
  private toggleComplete(uuid: string): void {
    this.todoService.toggleTodoComplete(uuid);
  }

  /* navigations */
  private goSummary(): void {
    this.router.navigateByUrl('/summary');
  }
  private goSettings(): void {
    this.router.navigateByUrl('/setting');
  }
}
