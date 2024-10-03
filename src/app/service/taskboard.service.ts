import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTask } from '../modal/user';

@Injectable({
  providedIn: 'root',
})
export class TaskboardService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description This is method to create a task.
   * @author Jagdish
   * @param {CreateTask} data - create task object.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  createTask(data: CreateTask): Observable<any> {
    let url = `${this.baseUrl}/taskBoard/create`;
    return this.http.post(url, data);
  }

  /**
   * @description This is method to GET task by department ID.
   * @author Jagdish
   * @param {id} id - department id.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  getTaskByDepartment(id: number): Observable<any> {
    let url = `${this.baseUrl}/taskBoard/department/${id}`;
    return this.http.get(url);
  }
}
