import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = "http://99.99.99.185:8089/spike";

  constructor(private http: HttpClient) {}
/**
 * @description Retrieves the token from local storage if available.
 * @author Gautam Yadav
 * @returns {string | null} Returns the token as a string, or null if not found.
 */
  getToken() {
    return localStorage.getItem('tkn');
  }

  /**
   * @description This is a clear local storage function.
   * @author Gautam Yadav
   * @return {string} Return a void
   */
  clearStorage():void {
    localStorage.clear();
  }

/**
 * @description Retrieves user details from local storage if available.
 * @author Gautam Yadav
 * @returns {string | null} Returns the user data as a string, or null if not found.
 */
  getUserDetails() {
    if (localStorage.getItem('userData')) {
      return localStorage.getItem('userData');
    }
    return null;
  }

/**
 * @description Stores data in local storage under a specified variable name.
 * @author Gautam Yadav
 * @param {string} variableName The key under which the data will be stored in local storage.
 * @param {any} data The data to store in local storage.
 * @returns {void} Does not return a value.
 */
  setDataInLocalStorage(variableName: string, data: any):void {
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
 
}
