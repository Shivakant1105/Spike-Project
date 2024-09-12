import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  toggle!: boolean

  constructor() { }

  ngOnInit(): void {
  }

  /**  
    * @description This is a theme function.  
    * @author Shiva Kant Mishra
    */

  notesSidebar(): void {
    this.toggle = !this.toggle;

  }
}
