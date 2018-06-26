import { Component, OnInit, Input, Output, TemplateRef, EventEmitter, OnDestroy } from '@angular/core';
import { NzDropdownService, NzMenuItemDirective, NzDropdownContextComponent } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { List } from '../../../domain/entities';
import { ListService } from '../../services/list/list.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [ './list.component.css' ]
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() collapsed: boolean;
  @Input() lists: List;
  @Output() contextList = new EventEmitter<string>();
  @Output() renameList = new EventEmitter<string>();
  @Output() clickList = new EventEmitter<string>();
  @Output() deleteList = new EventEmitter<string>();

  private dropdown: NzDropdownContextComponent;
  private currentContext = '';
  public currentList: string;
  private currentList$: Subscription;

  constructor(
    private dropdownService: NzDropdownService,
    private listService: ListService
  ) {
  }

  ngOnInit() {
    this.currentList$ = this.listService.getCurrentListSubject().subscribe((uuid => {
      this.currentList = uuid;
    }));

    this.listService.getAll();
  }

  ngOnDestroy() {
    this.currentList$.unsubscribe();
  }

  click(uuid: string): void {
    this.clickList.next(uuid);
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContext = uuid;
  }

  rename(): void {
    this.renameList.next(this.currentContext);
    this.currentContext = '';
  }

  delete(): void {
    this.deleteList.next(this.currentContext);
    this.currentContext = '';
  }

  close(e: NzMenuItemDirective): void {
    this.dropdown.close();
  }
}
