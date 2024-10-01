import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { user } from '../modal/user';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}
  loader = new BehaviorSubject<boolean>(false);
  baseUrl: string = environment.baseUrl;
  sideBarTogglebtn = new BehaviorSubject(false);
  toggleTheme = new BehaviorSubject('light-theme');

  /** @description This is a method to emit subject which will change theme.
   * @author Himmat
   * @param { string } theme
   * @return {void} Return a void
   */
  setToggleTheme(theme: string): void {
    this.toggleTheme.next(theme);
  }

  /** @description This is a toggle button for sidebar.
   * @author Gautam Yadav
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

  resetPassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = { oldPassword, newPassword };

    return this.http.put(`${this.baseUrl}/user/reset-password`, body);
  }

  /**
   * @description This is get all contacts details method
   * @author Shiva Kant
   * @returns  {Observable<any>}
   */

  getAllContacts(
    id: number,
    pageNo: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/user/contacts?userId=${id}&pageSize=${pageSize}&pageNo=${pageNo}`
    );
  }

  /**
   * @description This is method to get all department list.
   * @author Himmat
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/department/dropdown`);
  }

  /**
   * @description This is method to get all country list.
   * @author Himmat
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getCountry(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/countries`);
  }

  /**
   * @description This is method to get all state list based on country.
   * @author Himmat
   * @param {string} countryName - The country name.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getState(countryName: string): Observable<any> {
    let httpParams = new HttpParams().set('countryName', countryName);
    return this.http.get(`${this.baseUrl}/user/states`, { params: httpParams });
  }

  /**
   * @description This is method to get all city list based on state.
   * @author Himmat
   * @param {string} stateName - The state name.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getCity(stateName: string): Observable<any> {
    let httpParams = new HttpParams().set('stateName', stateName);
    return this.http.get(`${this.baseUrl}/user/cities`, { params: httpParams });
  }
  /**
   * @description get all userDetails by id
   * @author vivekSengar
   * @param {number}  id-userid
   * @returns {Observable<any>} return observable
   */
  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/user/self/${id}`);
  }
  /**
   * @description get department by id
   * @author Abhilasha Singh
   * @param {number}  id-userid
   * @returns {Observable<any>} return observable
   */
  getDepartmentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/department/${id}`);
  }
  /**
   * @description update user details
   * @author Abhilasha Singh
   * @param {number}  id-userid , userData
   * @returns {Observable<any>} return observable
   */
  updateUserDetail(id: number, userData: user): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update/details/${id}`, userData);
  }

  /**
   * @description for showing loader
   * @author vivekSengar
   * @returns {void} return void
   */
  showLoader(): void {
    this.loader.next(true);
  }
  /**
   * @description for remove loader
   * @author vivekSengar
   * @returns {void} return void
   */
  hideLoader(): void {
    this.loader.next(false);
  }
}
