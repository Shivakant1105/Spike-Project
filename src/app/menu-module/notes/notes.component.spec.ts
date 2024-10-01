import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesComponent } from './notes.component';
import { NotesService } from 'src/app/service/notes.service';
import { AuthService } from 'src/app/service/auth.service';
import { of } from 'rxjs';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let notesService: jasmine.SpyObj<NotesService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const notesServiceSpy = jasmine.createSpyObj('NotesService', [
      'getAllNotesById',
      'updatedBlog',
      'deleteNotesById',
      'createNotes',
      'notesColorChange',
      'updatedNotes',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getTokenData',
    ]);

    await TestBed.configureTestingModule({
      declarations: [NotesComponent],
      providers: [
        { provide: NotesService, useValue: notesServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    notesService = TestBed.inject(NotesService) as jasmine.SpyObj<NotesService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle sidebar', () => {
    expect(component.toggle).toBeFalse();
    component.notesSidebar();
    expect(component.toggle).toBeTrue();
    component.notesSidebar();
    expect(component.toggle).toBeFalse();
  });

  it('should delete note by ID', () => {
    const mockUserId = 1;
    const mockNoteId = 1;
    const mockNotes = { data: [] };

    notesService.deleteNotesById.and.returnValue(of({}));
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.deleteNotesById(mockNoteId, mockUserId);

    expect(notesService.deleteNotesById).toHaveBeenCalledWith(
      mockNoteId,
      mockUserId
    );
    expect(notesService.getAllNotesById).toHaveBeenCalledWith(mockUserId);
    expect(component.notes).toEqual(mockNotes.data);
  });

  it('should create a note', () => {
    const mockUserId = 1;
    const mockNotes = { data: [{ id: 1, content: 'New note' }] };

    notesService.createNotes.and.returnValue(of({}));
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.createNotes(mockUserId);

    expect(notesService.createNotes).toHaveBeenCalledWith(mockUserId);
    expect(notesService.getAllNotesById).toHaveBeenCalledWith(mockUserId);
    expect(component.notes).toEqual(mockNotes.data);
  });

  it('should emit the correct value when updatedBlog is called', () => {
    const mockNoteId = '1';
    const mockContent = 'Updated note content';

    component.updatedNotes(mockContent, mockNoteId);

    component.updateNoteSubject.subscribe((value) => {
      expect(value.content).toEqual(mockContent);
      expect(value.noteId).toEqual(mockNoteId);
    });
  });

  it('should update notes after calling updatedNotes', (done) => {
    const mockUserId = 1;
    const mockNoteId = '1';
    const mockContent = 'Updated note content';
    const mockNotes = { data: [{ id: 1, content: mockContent }] };

    authService.getTokenData.and.returnValue({ id: mockUserId });
    notesService.updatedNotes.and.returnValue(of({}));
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.ngOnInit();
    component.updatedNotes(mockContent, mockNoteId);

    setTimeout(() => {
      expect(notesService.updatedNotes).toHaveBeenCalledWith(
        mockContent,
        mockNoteId
      );
      expect(notesService.getAllNotesById).toHaveBeenCalledWith(mockUserId);
      expect(component.notes).toEqual(mockNotes.data);
      done();
    }, 350);
  });
  it('should update note content when a valid note ID is provided', (done) => {
    const mockUserId = 1;
    const mockNoteId = '1';
    const initialContent = 'Original note content';
    const updatedContent = 'Updated note content';

    const mockNotes = { data: [{ id: mockNoteId, content: initialContent }] };

    authService.getTokenData.and.returnValue({ id: mockUserId });
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.ngOnInit();

    component.updatedNotes(updatedContent, mockNoteId);

    notesService.updatedNotes.and.returnValue(of({}));

    setTimeout(() => {
      expect(notesService.updatedNotes).toHaveBeenCalledWith(
        updatedContent,
        mockNoteId
      );

      const updatedNote = component.notes.find(
        (note: any) => note.id === mockNoteId
      );
      expect(updatedNote).toBeDefined();
      expect(updatedNote.content).toEqual(updatedContent);

      done();
    }, 350);
  });
  it('should update note content when a valid note ID is provided', (done) => {
    const mockUserId = 1;
    const mockNoteId = '1';
    const initialContent = 'Original note content';
    const updatedContent = 'Updated note content';

    const mockNotes = { data: [{ id: mockNoteId, content: initialContent }] };

    authService.getTokenData.and.returnValue({ id: mockUserId });
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.ngOnInit();

    component.updatedNotes(updatedContent, mockNoteId);

    notesService.updatedNotes.and.returnValue(of({}));

    setTimeout(() => {
      expect(notesService.updatedNotes).toHaveBeenCalledWith(
        updatedContent,
        mockNoteId
      );

      const updatedNote = component.notes.find(
        (note: any) => note.id === mockNoteId
      );
      expect(updatedNote).toBeDefined();
      expect(updatedNote.content).toEqual(updatedContent);

      done();
    }, 350);
  });

  it('should change note color', () => {
    const mockColor = 'BLUE';
    const mockNoteId = '1';
    const mockNotes = { data: [{ id: 1, color: mockColor }] };

    notesService.notesColorChange.and.returnValue(of({}));
    notesService.getAllNotesById.and.returnValue(of(mockNotes));

    component.notesColorChange(mockColor, mockNoteId);

    expect(notesService.notesColorChange).toHaveBeenCalledWith(
      mockColor,
      mockNoteId
    );
    expect(notesService.getAllNotesById).toHaveBeenCalledWith(component.userId);
    expect(component.notes).toEqual(mockNotes.data);
  });

  it('should update noteContent and noteId when a note is clicked', () => {
    const mockNote = { id: '1', content: 'Test note content' };

    component.onNoteClick(mockNote);

    expect(component.noteContent).toEqual(mockNote.content);
    expect(component.noteId).toEqual(mockNote.id);
  });

  it('should return the note id for tracking', () => {
    const mockNote = { id: '1', content: 'Test note' };

    const result = component.trackByForNotes(mockNote);

    expect(result).toEqual(mockNote.id);
  });

  it('should return the correct background color from the color map', () => {
    const color = 'BLUE';
    const expectedColor = '#0085db';
    const result = component.getBackgroundColor(color);
    expect(result).toEqual(expectedColor);
  });

  it('should return white if the color is not in the color map', () => {
    const color = 'INVALID_COLOR';
    const result = component.getBackgroundColor(color);
    expect(result).toEqual('#ffffff');
  });
  it('should call searchWithContent and update notes when Enter is pressed with a search term', () => {
    const mockUserId = 1;
    const searchTerm = 'test';
    const mockNotesResponse = { data: [{ id: 1, content: 'Test note' }] };

    authService.getTokenData.and.returnValue({ id: mockUserId });

    component.ngOnInit();

    notesService.searchWithContent.and.returnValue(of(mockNotesResponse));

    const mockEvent = {
      key: 'Enter',
      target: { value: searchTerm },
    } as unknown as KeyboardEvent;

    component.searchNotes(mockEvent);

    expect(notesService.searchWithContent).toHaveBeenCalledWith(
      searchTerm,
      mockUserId
    );

    expect(component.notes).toEqual(mockNotesResponse.data);
  });
  it('should search notes when Enter is pressed with a search term', () => {
    const searchTerm = 'test';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const inputElement = { value: searchTerm } as HTMLInputElement;

    notesService.searchWithContent.and.returnValue(
      of({ data: ['note1', 'note2'] })
    );

    Object.defineProperty(event, 'target', { value: inputElement });

    component.searchNotes(event);

    expect(notesService.searchWithContent).toHaveBeenCalledWith(
      searchTerm,
      component.userId
    );
    expect(component.notes).toEqual(['note1', 'note2']);
  });

  it('should call searchWithContent and update notes when Enter is pressed with a valid search term', () => {
    const mockUserId = 1;
    const searchTerm = 'test note';
    const mockNotesResponse = { data: [{ id: '1', content: 'Test note' }] };

    authService.getTokenData.and.returnValue({ id: mockUserId });

    component.ngOnInit();
    notesService.searchWithContent.and.returnValue(of(mockNotesResponse));

    const mockEvent = {
      key: 'Enter',
      target: { value: searchTerm },
    } as unknown as KeyboardEvent;

    component.searchNotes(mockEvent);
    expect(notesService.searchWithContent).toHaveBeenCalledWith(
      searchTerm,
      mockUserId
    );
    expect(component.notes).toEqual(mockNotesResponse.data);
  });

  it('should get notes when input is empty', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const inputElement = { value: '' } as HTMLInputElement;
    spyOn(component, 'getNotes');
    Object.defineProperty(event, 'target', { value: inputElement });
    component.searchNotes(event);
    expect(component.getNotes).toHaveBeenCalled();
  });
});
