import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { SummaryComponent } from './summary/summary.component';
import { SettingComponent } from './setting/setting.component';
import { SetupComponent } from './setup/setup.component';

const routes: Routes = [
  { path: 'welcome', component: SplashComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'main', redirectTo: '/main', pathMatch: 'full' },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
