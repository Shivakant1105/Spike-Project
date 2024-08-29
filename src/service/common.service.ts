import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  sideBarTogglebtn = new BehaviorSubject(false);

  setSideBarToggleBtn(flag: boolean) {
    this.sideBarTogglebtn.next(flag);
  }
}
