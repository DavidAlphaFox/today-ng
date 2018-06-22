import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFile } from 'ng-zorro-antd';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import {
  USERNAME,
  AVATAR_CODE,
  INIT_FLAG,
  START_USING_DATE
} from '../services/local-storage/local-storage.namespace';
import { getTodayTime } from '../../utils/time';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit {
  private currentStep = 0;
  private username: string;
  private imgCode: string;

  constructor(private store: LocalStorageService, private router: Router) {}

  ngOnInit() {
    if (!!this.store.get(INIT_FLAG)) {
      this.router.navigateByUrl('/main');
    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  private handleAvatarImageChange(info: { file: UploadFile }): void {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.imgCode = img;
    });
  }

  private lastStep() {
    this.currentStep -= 1;
  }

  private nextStep() {
    this.currentStep += 1;
  }

  private completeSetup(): void {
    this.store.set(INIT_FLAG, true);
    this.store.set(START_USING_DATE, getTodayTime());
    this.store.set(USERNAME, this.username);
    this.store.set(AVATAR_CODE, this.imgCode);
    this.router.navigateByUrl('/main');
  }
}
