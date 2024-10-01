import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';

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
  noteContent: string = '';
  userId!: number;
  noteId!: string;
  backendColor!: string;
  updateNoteSubject = new Subject<{ content: string; noteId: string }>();
  colorMap: { [key: string]: string } = {
    BLUE: '#0085db',
    YELLOW: '#f8c076',
    GREY: '#707a83',
    RED: '#fb977d',
    GREEN: '#58d595',
  };
  updateSubscription!: Subscription;
  constructor(
    private notesService: NotesService,
    private authService: AuthService
  ) {
    this.updateSubscription = this.updateNoteSubject
      .pipe(debounceTime(300))
      .subscribe(({ content, noteId }) => {
        this.notesService
          .updatedBlog(content, noteId)
          .pipe(switchMap(() => this.notesService.getAllNotesById(this.userId)))
          .subscribe((res: any) => {
            this.notes = [...res.data];
          });
      });
  }

  ngOnInit(): void {
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
    this.notesService
      .deleteNotesById(noteId, userId)
      .pipe(switchMap(() => this.notesService.getAllNotesById(userId)))
      .subscribe((res: any) => {
        this.notes = [...res.data];
      });
  }
  /**
   * @description This methos describe  the create note functionality
   * @param {number} userId - The ID of the user whose notes is to be created.
   
   */
  createNotes(userId: number) {
    this.notesService
      .createNotes(userId)
      .pipe(switchMap(() => this.notesService.getAllNotesById(userId)))
      .subscribe((res: any) => {
        this.notes = [...res.data];
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
  updatedBlog(content: string, noteId: string) {
    this.updateNoteSubject.next({ content, noteId });
  }
  /**
   * @description This method changes the color of a specified note.
   * @param {string} color - The new color to apply to the note.
   * @param {string} noteId - The ID of the note whose color is to be changed.
   * @returns {Observable<any>} An observable that emits the server's response upon completion of the request.
   */
  notesColorChange(color: string, noteid: string) {
    if (noteid) {
      this.notesService
        .notesColorChange(color, noteid)
        .pipe(switchMap(() => this.notesService.getAllNotesById(this.userId)))
        .subscribe((res: any) => {
          this.notes = [...res.data];
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

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
