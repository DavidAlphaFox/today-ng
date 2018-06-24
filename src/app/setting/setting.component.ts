import { Component, ElementRef, Host, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { AVATAR_CODE, USERNAME } from '../services/local-storage/local-storage.namespace';
import { pageSwitchTransition } from './settings.animation';


@Component({
  selector   : 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls  : [ './setting.component.less' ],
  animations : [ pageSwitchTransition ]
})
export class SettingComponent implements OnInit {
  avatar = this.store.get(AVATAR_CODE);
  username = this.store.get(USERNAME);

  @HostBinding('@pageSwitchTransition') state = 'activated';
  @ViewChild('usernameInput') private usernameInput: ElementRef;

  constructor(
    private store: LocalStorageService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usernameInput.nativeElement.value = this.username;
  }

  validateUsername(username: string): void {
    if (!username) {
      this.message.error('用户名不能为空');
      this.usernameInput.nativeElement.value = this.username;
    } else if (username !== this.username) {
      this.username = username;
      this.store.set(USERNAME, username);
      this.message.success('用户名已修改');
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/main');
  }
}
