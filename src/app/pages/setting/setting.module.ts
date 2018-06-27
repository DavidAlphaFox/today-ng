import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SettingComponent } from './setting.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  declarations: [ SettingComponent ],
  providers   : [ LocalStorageService ]
})
export class SettingModule {}
