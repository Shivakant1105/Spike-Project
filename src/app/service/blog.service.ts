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

  /**
   * @description This is method to Post a blog.
   * @author Jagdish
   * @param {FormData} data - The postBlog object.
   * @returns {Observable<any>} An observable that emits the server's response.
   */
  postBlog(data: FormData): Observable<any> {
    let url = `${this.baseUrl}/blog/create`;
    return this.http.post(url, data);
  }
}
