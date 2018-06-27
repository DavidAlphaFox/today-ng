import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { TodoListComponent } from './right-control/todo/todo-list.component';
import { HeaderComponent } from './right-control/header/header.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './left-control/list/list.component';
import { SuggestComponent } from './right-control/header/suggest/suggest.component';
import { QuickAddComponent } from './right-control/quick-add/quick-add.component';
import { LeftControlComponent } from './left-control/left-control.component';
import { RightControlComponent } from './right-control/right-control.component';

@NgModule({
  imports     : [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    MainRoutingModule
  ],
  exports     : [ MainComponent ],
  declarations: [
    MainComponent,
    TodoListComponent,
    HeaderComponent,
    DetailComponent,
    ListComponent,
    SuggestComponent,
    QuickAddComponent,
    LeftControlComponent,
    RightControlComponent
  ]
})
export class MainModule {}
