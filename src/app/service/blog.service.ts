import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description This is get all blogs details method
   * @author Shiva Kant
   * @returns  {Observable<any>}
   */

  getAllBlogs(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/blog/get-all?pageNum=${pageNo}&pageSize=${pageSize}`
    );
  }

  createBlog(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/blog/create`, data);
  }
}
