import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {}
  /**
   * @description Retrieves the token from local storage if available.
   * @author Gautam Yadav
   * @returns {string | null} Returns the token as a string, or null if not found.
   */
  getToken() {
    return localStorage.getItem('tkn');
  }

  /**
   * @description Clear a specific item from localStorage function.
   * @author Gautam Yadav
   * @return {string} Return a void
   */
  clearStorageByKey(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * @description Stores data in local storage under a specified variable name.
   * @author Gautam Yadav
   * @param {string} variableName The key under which the data will be stored in local storage.
   * @param {any} data The data to store in local storage.
   * @returns {void} Does not return a value.
   */
  setDataInLocalStorage(variableName: string, data: string): void {
    localStorage.setItem(variableName, data);
  }

  /**
   * @description Sends a login request to the server with the provided payload and returns the response as an observable.
   * @author Gautam Yadav
   * @param {any} payload The login data to be sent in the request body.
   * @returns {Observable<any>} Returns an observable containing the server response.
   */
  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/public/login`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }
  /**
   * @description decode the token
   * @author vivekSengar
   */
  getTokenData(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
  /**
   * @description This method sescribe the logout funtionality
   * @author vivekSengar
   */
  logout(): void {
    this.clearStorageByKey('tkn');
    this.router.navigateByUrl('/auth/login');
  }
}
