import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: 'main',
    component: CoreComponent,
    children: [
      {
        path: ':id',
        component: DetailComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule { }
