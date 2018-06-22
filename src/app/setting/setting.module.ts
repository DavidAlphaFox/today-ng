import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SummaryService } from '../services/summary/summary.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ SettingComponent ],
  providers: [ SummaryService ]
})
export class SettingModule { }
