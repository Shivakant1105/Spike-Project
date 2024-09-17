import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.baseUrl

  sideBarTogglebtn = new BehaviorSubject(false);

  /*   @description This is a toggle button for sidebar.
   *   @author Gautam Yadav
   * @params {flag:boolean}
   * @return {void} Return a void
   */
  setSideBarToggleBtn(flag: boolean): void {
    this.sideBarTogglebtn.next(flag);
  }

  /**
 * @description This method allows a user to reset their password.
 * @author Abhilasha Singh
 * @param {string} oldPassword - The user's current password that needs to be verified before setting the new password.
 * @param {string} newPassword - The user's desired new password.
 * @returns {Observable<any>} An observable that emits the server's response.
 */

  resetPassword( oldPassword: string, newPassword: string): Observable <any> {  
    const body = { oldPassword, newPassword };
    return this.http.put(`${this.baseUrl}/user/reset-password`,body)
  }
}
