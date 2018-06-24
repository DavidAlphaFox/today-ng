import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ListService } from '../list/list.service';
import { floorToMinute, ONE_HOUR, getCurrentTime } from '../../../utils/time';
import { Todo } from '../../../domain/entities';

@Injectable()
export class TodoService {
  private lsKey = 'todos';
  private todos: Todo[] = [];
  private todo$ = new Subject<Todo[]>();

  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {}

  private broadCast(): void {
    this.todo$.next(this.todos);
  }

  private persist(): void {
    this.store.set(this.lsKey, this.todos);
  }

  getSubject(): Subject<Todo[]> {
    return this.todo$;
  }

  getAll(): void {
    this.todos = this.store.getList(this.lsKey);
    this.broadCast();
  }

  getRaw(): Todo[] {
    return this.todos;
  }

  getByUUID(uuid: string): Todo | null {
    return this.todos.filter((todo: Todo) => todo._id === uuid)[0] || null;
  }

  setTodoToday(uuid: string): void {
    const todo = this.todos.find(t => t._id === uuid);
    if (todo && !todo.completedFlag) {
      todo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      this.update(todo);
    }
  }

  toggleTodoComplete(uuid: string): void {
    const todo = this.todos.find(t => t._id === uuid);
    if (todo) {
      todo.completedFlag = !todo.completedFlag;
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.persist();
    }
  }

  add(title: string): void {
    const listUUID = this.listService.getCurrentUUID();
    const newTodo = new Todo(title, listUUID);

    if (listUUID === 'today') {
      newTodo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      newTodo.listUUID = 'todo';
    }

    this.todos.push(newTodo);
    this.persist();
    this.broadCast();
  }

  update(todo: Todo): void {
    const index = this.todos.findIndex(t => t._id === todo._id);
    if (index !== -1) {
      this.todos.splice(index, 1, todo);
      this.persist();
      this.broadCast();
    }
  }

  delete(uuid: string): void {
    const index = this.todos.findIndex(t => t._id === uuid);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.persist();
      this.broadCast();
    }
  }

  deleteInList(uuid: string): void {
    const toDelete = this.todos.filter(t => t.listUUID === uuid);
    toDelete.forEach(t => this.delete(t._id));
  }
}
