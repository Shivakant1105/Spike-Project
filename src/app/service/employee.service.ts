import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { employee } from '../modal/user';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  baseUrl: string = environment.baseUrl;

  /**
   * @description This is method to create employee.
   * @author Himmat
   * @param {employee} data - The employee object.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  createEmployee(data: employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/create`, data);
  }

  /**
   * @description This is method to get all manager list.
   * @author Himmat
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getAllManagersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/managers`);
  }

  /**
   * @description This is method to post profile image of user.
   * @author Himmat
   * @param {FormData} data
   * @param {number} id
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  uploadProfileImage(data: FormData, id: number) {
    let url = `${this.baseUrl}/user/add/picture/${id}`;
    return this.http.post(url, data);
  }

  /**
   * @description This is method to get all employee.
   * @author Himmat
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getAllEmployee(pageSize?: number, pageNumber?: number) {
    const url = `${this.baseUrl}/user/employees?page=${pageNumber}&size=${pageSize}`;
    return this.http.get(url);
  }

  /**
   * @description This is method to delete employee.
   * @author Himmat
   * @param {number} employeeId
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  deleteEmployee(employeeId: number) {
    return this.http.delete(`${this.baseUrl}/user/delete/${employeeId}`);
  }

  /**
   * @description This is method to edit employee.
   * @author Himmat
   * @param {number} id
   * @param {employee} data
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  editEmployee(id: number, data: employee) {
    return this.http.put(`${this.baseUrl}/user/admin/update/${id}`, data);
  }

  /**
   * @description This is method to update profile image of user.
   * @author Abhilasha Singh
   * @param {FormData} data
   * @returns {Observable<any>} An observable that emits the server's response.
   */

  updateSelfProfileImage(data: FormData) {
    let url = `${this.baseUrl}/user/update/profile-picture`;
    return this.http.put(url, data);
  }
}
