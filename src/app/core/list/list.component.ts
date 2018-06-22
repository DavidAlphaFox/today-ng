import { Component, OnInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { NzDropdownService, NzMenuItemDirective, NzDropdownContextComponent } from 'ng-zorro-antd';
import { List } from '../../../domain/entities';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [ './list.component.css' ]
})
export class ListComponent implements OnInit {
  @Input() private lists: List;
  @Output() contextList = new EventEmitter<string>();
  @Output() renameList = new EventEmitter<string>();
  @Output() clickList = new EventEmitter<string>();
  @Output() deleteList = new EventEmitter<string>();

  private dropdown: NzDropdownContextComponent;
  private currentContext = '';

  constructor(private dropdownService: NzDropdownService) { }

  ngOnInit() { }

  private click(uuid: string): void {
    this.clickList.next(uuid);
  }

  private contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContext = uuid;
  }

  private rename(): void {
    this.renameList.next(this.currentContext);
    this.currentContext = '';
  }

  private delete(): void {
    this.deleteList.next(this.currentContext);
    this.currentContext = '';
  }

  private close(e: NzMenuItemDirective): void {
    this.dropdown.close();
  }
}
