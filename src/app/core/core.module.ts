import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CoreComponent } from './core.component';
import { CoreRoutingModule } from './core.routing.module';
import { TodoListComponent } from './todo/todo-list.component';
import { HeaderComponent } from './header/header.component';
import { DetailComponent } from './detail/detail.component';
import { TimeService } from '../services/time/time.service';
import { ListComponent } from './list/list.component';
import { SuggestComponent } from './suggest/suggest.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    CoreRoutingModule
  ],
  exports: [ CoreComponent ],
  declarations: [
    CoreComponent,
    TodoListComponent,
    HeaderComponent,
    DetailComponent,
    ListComponent,
    SuggestComponent
  ],
  providers: [ TimeService ]
})
export class CoreModule { }
