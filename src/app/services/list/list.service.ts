import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { List } from '../../../domain/entities';
import { LISTS } from '../local-storage/local-storage.namespace';
import { LoggerService } from '../logger/logger.service';


type SpecialListUUID = 'today' | 'todo';

@Injectable()
export class ListService {
  private currentUUID: SpecialListUUID | string = 'today';
  private lists: List[] = [];

  private currentUUID$ = new Subject<string>();
  private lists$ = new Subject<List[]>();

  constructor(
    private store: LocalStorageService,
    private logger: LoggerService
  ) { }

  private broadCast(): void {
    this.lists$.next(this.lists);
    this.currentUUID$.next(this.currentUUID);
  }

  private persist(): void {
    this.store.set(LISTS, this.lists);
  }

  getSubject(): Subject<List[]> {
    return this.lists$;
  }

  getCurrentListSubject(): Subject<string> {
    return this.currentUUID$;
  }

  getAll(): void {
    this.lists = this.store.getList(LISTS);
    this.broadCast();
  }

  getCurrentUUID(): string | undefined {
    return this.currentUUID;
  }

  setCurrentUUID(uuid: string): void {
    this.currentUUID = uuid;
    this.broadCast();
  }

  add(title: string): void {
    const newList = new List(title);
    this.lists.push(newList);
    this.currentUUID = newList._id;
    this.logger.message('[INFO] list created', newList);
    this.broadCast();
    this.persist();
  }

  update(list: List): void {
    const index = this.lists.findIndex(l => l._id === list._id);
    if (index === -1) {
      this.lists.splice(index, 1, list);
      this.persist();
      this.broadCast();
    }
  }

  delete(uuid: string): void {
    const i = this.lists.findIndex(l => l._id === uuid);
    if (i !== -1) {
      this.lists.splice(i, 1);
      this.currentUUID = this.lists.length
        ? this.lists[ this.lists.length - 1 ]._id
        : this.currentUUID === 'today'
          ? 'today'
          : 'todo';
      this.broadCast();
      this.persist();
    }
  }
}
