import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}
  /**
   * @description This methos describe  the delete functionality of notes
   * @param {number} userId = The ID of the user whose notes is to be fetched.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  getAllNotesById(userId: number) {
    return this.http.get(`${this.baseUrl}/notes/fetch/${userId}`);
  }
  /**
   * @description This methos describe  the delete functionality of notes
   * @param {number} noteId - The ID of the notes whose content is to be deleted.
   * @param {number} userId = The ID of the user whose notes is to be deleted.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  deleteNotesById(noteId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notes/delete/${noteId}/${userId}`);
  }
  /**
   * @description This methos describe  the create note functionality
   * @param {number} userId - The ID of the user whose notes is to be created.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  createNotes(userId: number) {
    return this.http.post(`${this.baseUrl}/notes/create?userId=${userId}`, {});
  }
  /**
   * @description This methos describe the Updated notes functionality
   * @param {string} content - The content is updated content
   * @param {string} noteId - The ID of the note whose content is to be changed.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  updatedNotes(content: string, noteId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notes/edit/${noteId}`, { content });
  }
  /**
   * @description This method changes the color of a specified note.
   * @param {string} color - The new color to apply to the note.
   * @param {string} noteId - The ID of the note whose color is to be changed.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  notesColorChange(color: string, noteId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notes/color/${noteId}/${color}`, {});
  }
  searchWithContent(search: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/notes/fetch/${userId}?content=${search}`
    );
  }
}
