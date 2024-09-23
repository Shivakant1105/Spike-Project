import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { employee } from '../modal/user';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  baseUrl:string=environment.baseUrl;

    /**
 * @description This is method to create employee.
 * @author Himmat
 * @param {employee} data - The employee object.
 * @returns {Observable<any>} An observable that emits the server's response.
 */
  createEmployee(data:employee):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/create`,data)
  }
}
