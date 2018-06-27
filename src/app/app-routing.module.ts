import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { SettingComponent } from './pages/setting/setting.component';
import { SetupComponent } from './pages/setup/setup.component';
import { InitGuardService } from './services/init-guard/init-guard.service';


const routes: Routes = [
  { path: 'welcome', component: SplashComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [ InitGuardService ] },
  { path: 'setting', component: SettingComponent, canActivate: [ InitGuardService ] },
  { path: 'setup', component: SetupComponent, canActivate: [ InitGuardService ] },
  { path: 'main', redirectTo: '/main', pathMatch: 'full' },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
