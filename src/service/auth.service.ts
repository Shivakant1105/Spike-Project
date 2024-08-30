import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  isLogin = new BehaviorSubject(true);
  /*
   * @description This is a logout method.
   *@author Gautam Yadav
   *@params {flag:boolean}
   * @return {void} Return a void
   */
  logout(flag: boolean): void {
    this.isLogin.next(flag);
  }
}
