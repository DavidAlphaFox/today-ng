import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
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
import { RankBy } from '../../domain/types';
import { floorToDate } from '../../utils/time';
import { mainPageSwitchTransition } from './core.animation';
import { current } from 'codelyzer/util/syntaxKind';


const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1: Todo, t2: Todo) => {
      if (t1.completedFlag && !t2.completedFlag) { return 1; }
    };
  }
  return (t1: Todo, t2: Todo) => t1[ type ] > t2[ type ];
};

@Component({
  selector   : 'app-core',
  templateUrl: './core.component.html',
  styleUrls  : [ './core.component.less' ],
  animations : [ mainPageSwitchTransition ]
})
export class CoreComponent implements OnInit, OnDestroy {
  isCollapsed = false;

  private todos$: Subscription;
  private lists$: Subscription;
  private currentList$: Subscription;
  private rankerSource = new Subject<RankBy>();

  addTodoModalVisible = false;
  addListModalVisible = false;
  renameListModalVisible = false;
  currentList: List;
  temporaryListUUID: string;

  innerTodos: Todo[] = [];
  innerLists: List[] = [];
  username = this.store.get(USERNAME);

  @HostBinding('@mainPageSwitchTransition') state = 'activated';
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

  /* An callback invoked when a key is pressed. */
  private keyboard$: any;

  ngOnInit() {
    this.makeSubscriptions();
    this.keyboard$ = this.keyboardHandler.bind(this);
    window.addEventListener('keydown', this.keyboard$);
  }

  ngOnDestroy() {
    if (this.lists$) { this.lists$.unsubscribe(); }
    if (this.todos$) { this.todos$.unsubscribe(); }
    if (this.currentList$) {this.currentList$.unsubscribe(); }
    window.removeEventListener('keydown', this.keyboard$);
  }

  private makeSubscriptions(): void {
    const listSource = this.listService.getSubject();
    const currentUUIDSource = this.listService.getCurrentListSubject();
    const todoSource = this.todoService.getSubject();
    const combined = currentUUIDSource.pipe(combineLatest(todoSource, this.rankerSource));

    this.lists$ = listSource.subscribe(lists => {
      this.innerLists = [].concat(lists);
    });
    this.currentList$ = currentUUIDSource.subscribe(uuid => {
      this.currentList = this.innerLists.find(l => l._id === uuid);
    });
    this.todos$ = combined.subscribe(sources => {
      this.processTodos(sources[ 0 ], sources[ 1 ], sources[ 2 ]);
    });

    this.listService.getAll();
    this.todoService.getAll();
    this.rankerSource.next();
  }

  private keyboardHandler(e: KeyboardEvent): void {
    // command+B to create a new list
    if (e.keyCode === 66 && (e.metaKey || e.ctrlKey)) {
      this.showAddListModal();
      return;
    }

    // command+I to create a new todo
    if (e.keyCode === 73 && (e.metaKey || e.ctrlKey)) {
      if (e.altKey) { return; }
      this.showAddTodoModal();
      return;
    }

    if (e.keyCode === 27) {
      this.closeAddListModal();
      this.closeAddTodoModal();
      this.closeRenameListModal();
    }
  }

  private processTodos(uuid: string, todos: Todo[], rank: RankBy): void {
    const filteredTodos = todos
      .filter(todo => {
        if (uuid === 'today' && todo.planAt && floorToDate(todo.planAt) === floorToDate(new Date())) { return true; }
        if (uuid === 'todo' && (!todo.listUUID || todo.listUUID === 'todo')) { return true; }
        if (uuid === todo.listUUID) { return true; }
        return false;
      })
      .map(todo => {
        return Object.assign({}, todo);
      })
      .sort(rankerGenerator(rank));

    this.innerTodos = [].concat(filteredTodos);
  }

  /* events on modals */
  showAddTodoModal(): void {
    this.addTodoModalVisible = true;
    setTimeout(() => { this.todoInput.nativeElement.focus(); });
  }

  closeAddTodoModal(): void { this.addTodoModalVisible = false; }

  showAddListModal(): void {
    this.addListModalVisible = true;
    setTimeout(() => { this.listInput.nativeElement.focus(); });
  }

  closeAddListModal(): void { this.addListModalVisible = false; }

  showRenameListModal(uuid: string): void {
    this.renameListModalVisible = true;
    this.temporaryListUUID = uuid;
    setTimeout(() => {
      const title = this.innerLists.find(l => l._id === uuid).title;
      this.listRenameInput.nativeElement.value = title;
      this.listRenameInput.nativeElement.focus();
    });
  }

  closeRenameListModal(): void { this.renameListModalVisible = false; }

  /* events on lists */
  handleAddListOk(title: string): void {
    if (title) { this.listService.add(title); }
    this.closeAddListModal();
  }

  confirmDeleteList(uuid: string): void {
    const i = this.innerLists.findIndex(l => l._id === uuid);
    const list = this.innerLists[ i ];

    this.modal.confirm({
      nzTitle  : '确认删除列表',
      nzContent: '该操作会导致该列表下的所有待办事项被删除',
      nzOnOk   : () =>
        new Promise((res, rej) => {
          this.listService.delete(uuid);
          this.todoService.deleteInList(uuid);
          res();
        }).catch(() => console.error('Delete list failed'))
    });
  }

  renameList(title: string): void {
    const list = this.innerLists.find(l => l._id === this.temporaryListUUID);
    list.title = title;
    this.listService.update(list);
    this.closeRenameListModal();
    this.temporaryListUUID = '';
  }

  clickList(uuid: string): void {
    this.listService.setCurrentUUID(uuid);
  }

  /* events on todos */
  handleAddTodoOk(title: string): void {
    if (title) {
      this.todoService.add(title);
    }
    this.closeAddTodoModal();
  }

  handleTodoClick(uuid: string): void { this.router.navigateByUrl(`main/${uuid}`); }

  deleteTodo(uuid: string): void { this.todoService.delete(uuid); }

  setToday(uuid: string): void { this.todoService.setTodoToday(uuid); }

  toggleComplete(uuid: string): void { this.todoService.toggleTodoComplete(uuid); }

  /* events from header */
  handleRankerChange(type: RankBy): void { this.rankerSource.next(type); }

  /* navigation */
  goSummary(): void { this.router.navigateByUrl('/summary'); }

  goSettings(): void { this.router.navigateByUrl('/setting'); }
}
