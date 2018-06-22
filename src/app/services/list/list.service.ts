import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { List } from '../../../domain/entities';


type SpecialListUUID = 'today' | 'todo';

@Injectable()
export class ListService {
  private lsKey = 'lists';

  private currentUUID: SpecialListUUID | string = 'today';
  private lists: List[] = [];

  private currentUUID$ = new Subject<string>();
  private lists$ = new Subject<List[]>();

  constructor(private store: LocalStorageService) { }

  private broadCast(): void {
    this.lists$.next(this.lists);
    this.currentUUID$.next(this.currentUUID);
  }

  private persist(): void {
    this.store.set(this.lsKey, this.lists);
  }

  getSubject(): Subject<List[]> {
    return this.lists$;
  }

  getCurrentSubject(): Subject<string> {
    return this.currentUUID$;
  }

  getAll(): void {
    this.lists = this.store.getList(this.lsKey);
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
      this.broadCast();
      this.persist();
    }
  }
}
