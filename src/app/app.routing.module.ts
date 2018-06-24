import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { SummaryComponent } from './summary/summary.component';
import { SettingComponent } from './setting/setting.component';
import { SetupComponent } from './setup/setup.component';
import { InitGuardService } from './services/init-guard/init-guard.service';


const routes: Routes = [
  { path: 'welcome', component: SplashComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [ InitGuardService ] },
  { path: 'setting', component: SettingComponent, canActivate: [ InitGuardService ] },
  { path: 'setup', component: SetupComponent, canActivate: [ InitGuardService ] },
  { path: 'main', redirectTo: '/main', pathMatch: 'full', canActivate: [ InitGuardService ] },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
