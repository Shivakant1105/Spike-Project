import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuModuleRoutingModule } from './menu-module-routing.module';
import { ContactComponent } from './contact/contact.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CourseComponent } from './course/course.component';
import { EmployeeComponent } from './employee/employee.component';
import { ChatComponent } from './chat/chat.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesComponent } from './notes/notes.component';
import { PostComponent } from './blog/post/post.component';
import { DetailComponent } from './blog/detail/detail.component';
import { EmailComponent } from './email/email.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SharedModule } from '../shared/shared.module';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { TodoComponent } from './todo/todo.component';

@NgModule({
  declarations: [
    ContactComponent,
    CalendarComponent,
    CourseComponent,
    EmployeeComponent,
    ChatComponent,
    NotesComponent,
    PostComponent,
    DetailComponent,
    EmailComponent,
    TicketsComponent,
    TaskboardComponent,
    TodoComponent,
  ],
  imports: [
    CommonModule,
    MenuModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FeatherModule.pick(allIcons),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SharedModule,
  ],
})
export class MenuModuleModule {}
