import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SummaryComponent } from './summary.component';


@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  declarations: [ SummaryComponent ]
})
export class SummaryModule { }
