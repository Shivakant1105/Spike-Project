import { TestBed } from '@angular/core/testing';

import { NotesService } from './notes.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

describe('NotesService', () => {
  let service: NotesService;
  let httpMock: HttpTestingController;
  let baseUrl: string = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [NotesService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(NotesService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch all notes by user ID', () => {
    const userId = 1;
    const mockNotes = { data: [{ id: 1, content: 'Test note' }] };

    service.getAllNotesById(userId).subscribe((notes) => {
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne(`${baseUrl}/notes/fetch/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);
  });

  it('should delete a note by note ID and user ID', () => {
    const noteId = 1;
    const userId = 1;

    service.deleteNotesById(noteId, userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${baseUrl}/notes/delete/${noteId}/${userId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a note for a user', () => {
    const userId = 1;

    service.createNotes(userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/notes/create?userId=${userId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
  it('should update the blog and return the response', () => {
    const content = 'Updated blog content';
    const noteId = '123';
    const mockResponse = { success: true };

    service.updatedNotes(content, noteId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/notes/edit/${noteId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ content });
    req.flush(mockResponse);
  });
  it('should change the color of a note and return the HTTP response', () => {
    const mockColor = 'BLUE';
    const mockNoteId = '1';

    service.notesColorChange(mockColor, mockNoteId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${baseUrl}/notes/color/${mockNoteId}/${mockColor}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});

    req.flush({ success: true });
  });

  it('should handle an error response', () => {
    const mockColor = 'GREEN';
    const mockNoteId = '2';

    service.notesColorChange(mockColor, mockNoteId).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(
      `${baseUrl}/notes/color/${mockNoteId}/${mockColor}`
    );
    req.flush('Something went wrong', { status: 404, statusText: 'Not Found' });
  });
});
