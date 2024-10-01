import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Subject, Subscription, switchMap } from 'rxjs';

import { AuthService } from 'src/app/service/auth.service';
import { NotesService } from 'src/app/service/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  toggle: boolean = false;
  notes: any;
  orginalNotes: any;
  noteContent: string = '';
  userId!: number;
  noteId!: string;
  backendColor!: string;
  updateNoteSubject = new Subject<{ content: string; noteId: string }>();
  color!: string;
  colorMap: { [key: string]: string } = {
    BLUE: '#0085db',
    YELLOW: '#f8c076',
    GREY: '#707a83',
    RED: '#fb977d',
    GREEN: '#58d595',
  };
  classChange: boolean = false;
  updateSubscription!: Subscription;
  constructor(
    private notesService: NotesService,
    private authService: AuthService
  ) {
    this.updateSubscription = this.updateNoteSubject
      .pipe(
        debounceTime(300),
        switchMap(({ content, noteId }) =>
          this.notesService
            .updatedNotes(content, noteId)
            .pipe(map(() => ({ content, noteId })))
        )
      )
      .subscribe(({ content, noteId }) => {
        const noteIndex = this.notes.findIndex(
          (note: any) => note.id === noteId
        );
        if (noteIndex !== -1) {
          this.notes[noteIndex].content = content;
        }
      });
  }

  ngOnInit(): void {
    this.getNotes();
  }
  getNotes() {
    if (this.authService.getTokenData()) {
      this.userId = this.authService.getTokenData().id;
      this.notesService.getAllNotesById(this.userId).subscribe({
        next: (res: any) => {
          this.notes = [...res.data];
        },
      });
    }
  }
  /**
   * @description This is a notesSidebar.
   * @author Shiva Kant Mishra
   */

  notesSidebar(): void {
    this.toggle = !this.toggle;
  }
  trackByForNotes(notes: any) {
    return notes.id;
  }

  /**
   * @description This methos describe  the delete functionality of notes and for render  it will store notes
   * @param {number} noteId - The ID of the notes whose content is to be deleted.
   * @param {number} userId = The ID of the user whose notes is to be deleted.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  deleteNotesById(noteId: number, userId: number): void {
    this.notesService.deleteNotesById(noteId, userId).subscribe(() => {
      this.notesService.getAllNotesById(userId).subscribe((res: any) => {
        this.notes = [...res.data];
      });
    });
  }
  /**
   * @description This methos describe  the create note functionality
   * @param {number} userId - The ID of the user whose notes is to be created.
   
   */
  createNotes(userId: number) {
    this.notesService.createNotes(userId).subscribe(() => {
      this.notesService.getAllNotesById(userId).subscribe((res: any) => {
        this.notes = [...res.data];
      });
    });
  }
  /**
   * @description This methos describe the note is active and ready to update
   * @param {any} note - This is the note where all data present
   
   */
  onNoteClick(note: any) {
    this.noteContent = note.content;
    this.noteId = note.id;
  }
  /**
   * @description This methos describe the Updated notes functionality
   * @param {string} content - The content is updated content
   * @param {string} noteId - The ID of the note whose content is to be changed.
   */
  updatedNotes(content: string, noteId: string) {
    if (noteId) {
      this.updateNoteSubject.next({ content, noteId });
    }
  }
  /**
   * @description This method changes the color of a specified note.
   * @param {string} color - The new color to apply to the note.
   * @param {string} noteId - The ID of the note whose color is to be changed.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  notesColorChange(color: string, noteid: string) {
    this.color;
    if (noteid) {
      this.notesService.notesColorChange(color, noteid).subscribe(() => {
        this.notesService.getAllNotesById(this.userId).subscribe((res: any) => {
          this.notes = [...res.data];
        });
      });
    }
  }
  /**
   * @description This method changes the color of a specified note.
   * @param {string} color - The new color to apply to the note.
   * @returns {string} return color
   */
  getBackgroundColor(color: string): string {
    return this.colorMap[color] || '#ffffff';
  }

  searchNotes(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase();
    if (event.key == 'Enter' && searchTerm) {
      this.notesService
        .searchWithContent(searchTerm, this.userId)
        .subscribe((res: any) => {
          this.notes = res.data;
        });
    }

    if (!searchTerm) {
      this.getNotes();
    }
  }
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
