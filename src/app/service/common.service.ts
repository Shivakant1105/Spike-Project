import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  sideBarTogglebtn = new BehaviorSubject(false);
  /* @description This is a toggle button for sidebar.
   * @author Gautam Yadav
   * @params {flag:boolean}
   * @return {void} Return a void
   */
  setSideBarToggleBtn(flag: boolean): void {
    this.sideBarTogglebtn.next(flag);
  }
}
