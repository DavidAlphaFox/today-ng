import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { CoreModule } from './core/core.module';
import { SettingModule } from './setting/setting.module';
import { SummaryModule } from './summary/summary.module';
import { SplashModule } from './splash/splash.module';
import { SetupModule } from './setup/setup.module';

import { LocalStorageService } from './services/local-storage/local-storage.service';
import { TodoService } from './services/todo/todo.service';
import { ListService } from './services/list/list.service';
import { SummaryService } from './services/summary/summary.service';

// Register locale for ng-zorro-antd.
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    CoreModule,
    SplashModule,
    SettingModule,
    SummaryModule,
    SetupModule
  ],
  providers: [
    TodoService,
    ListService,
    LocalStorageService,
    { provide: NZ_I18N, useValue: zh_CN },
    SummaryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
