import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
  /**
   * @description Fetches all comments associated with a specific blog post.
   * @author Gautam Yadav
   * @param {string} id - The ID of the blog post for which to retrieve all comments.
   * @returns {Observable<any>} return Observable
   */
  getAllCommentById(id: string) {
    return this.http.get(`${this.baseUrl}/comments/get/all/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  /**
   * @description Fetches a specific comment by its ID for a blog post.
   * @author Gautam Yadav
   * @param {string} id - The ID of the comment to retrieve.
   * @returns {Observable<any>} - return Observable
   */
  getCommentById(id: string) {
    return this.http.get(`${this.baseUrl}/comments/get/comment/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  /**
   * @description Updates an existing comment for a specific blog post using the provided payload data.
   * @author Gautam Yadav
   * @param {string} id - The ID of the comment to be updated.
   * @param {any} payload -  any type
   * @returns {Observable<any>} - return Observable
   */
  updateCommentById(id: string, payload: any) {
    return this.http.put(`${this.baseUrl}/comments/update/${id}`, payload);
  }
  /**
   * @description Creates a new comment for a specific blog post using the provided payload data.
   * @author Gautam Yadav
   * @param {string} id - The ID of the blog post to which the comment should be added.
   * @param {any} payload - The data for the new comment (e.g., comment content).
   * @returns {Observable<any>} - return Observable
   */
  createCommentById(id: string, payload: any) {
    return this.http.post(
      `${this.baseUrl}/comments/add-comment/${id}`,
      payload
    );
  }
  /**
   * @description Deletes a specific comment from a blog post by providing the blog ID and the comment ID.
   * @author Gautam Yadav
   * @param {string} blogId - The ID of the blog post from which the comment is to be deleted.
   * @param {string} commentId - The ID of the comment to delete.
   * @returns {Observable<any>} - return Observable
   */
  deleteCommentById(blogId: string, commentId: string) {
    return this.http.delete(
      `${this.baseUrl}/comments/delete/${blogId}/${commentId}`
    );
  }
}
