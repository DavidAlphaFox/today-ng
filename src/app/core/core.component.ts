import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: ['./core.component.less']
})
export class CoreComponent implements OnInit, OnDestroy {
  private isCollapsed = false;

  private todos$: Subscription;
  private lists$: Subscription;

  private innerTodos: Todo[] = [];
  private innerLists: List[] = [];

  private addTodoModalVisible = false;
  private addListModalVisible = false;
  private renameListModalVisible = false;

  private tempUUID: string;

  private avatar = this.store.get(AVATAR_CODE);
  private username = this.store.get(USERNAME);

  constructor(
    private todoService: TodoService,
    private listService: ListService,
    private router: Router,
    private modal: NzModalService,
    private store: LocalStorageService
  ) {}

  ngOnInit() {
    if (!this.store.get(INIT_FLAG)) {
      this.router.navigateByUrl('/setup');
      return;
    }
    this.makeSubcriptions();
  }

  ngOnDestroy() {
    if (this.lists$) {
      this.lists$.unsubscribe();
    }
    if (this.todos$) {
      this.todos$.unsubscribe();
    }
  }

  private makeSubcriptions(): void {
    const listSource = this.listService.getSubject();
    const currentUUIDSource = this.listService.getCurrentSubject();
    const todoSource = this.todoService.getSubject();
    const combined = currentUUIDSource.pipe(combineLatest(todoSource));

    this.lists$ = listSource.subscribe((lists: List[]) => {
      this.innerLists = [].concat(lists);
    });
    this.todos$ = combined.subscribe(sources => {
      this.processTodos(sources[0], sources[1]);
    });

    this.listService.getAll();
    this.todoService.getAll();
  }

  private processTodos(uuid: string, todos: Todo[]): void {
    const filteredTodos = todos
      .filter(todo => {
        if (
          uuid === 'today' &&
          todo.planAt &&
          floorToDate(todo.planAt) === floorToDate(new Date())
        ) {
          return true;
        }
        if (uuid === 'todo' && (!todo.listUUID || todo.listUUID === 'todo')) {
          return true;
        }
        if (uuid === todo.listUUID) {
          return true;
        }
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
  }
  private closeAddTodoModal(): void {
    this.addTodoModalVisible = false;
  }
  private showAddListModal(): void {
    this.addListModalVisible = true;
  }
  private closeAddListModal(): void {
    this.addListModalVisible = false;
  }
  private showRenameListModal(uuid: string): void {
    this.renameListModalVisible = true;
    this.tempUUID = uuid;
  }
  private closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }

  /* events on lists */
  private handleAddListOk(title: string): void {
    if (title) {
      this.listService.add(title);
    }
    this.closeAddListModal();
  }
  private confirmDeleteList(uuid: string): void {
    const i = this.innerLists.findIndex(l => l._id === uuid);
    const list = this.innerLists[i];

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
    const list = this.innerLists.find(l => l._id === this.tempUUID);
    list.title = title;
    this.listService.update(list);
    this.closeRenameListModal();
    this.tempUUID = '';
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
