import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ContactComponent } from './contact/contact.component';
import { CourseComponent } from './course/course.component';
import { EmployeeComponent } from './employee/employee.component';
import { ChatComponent } from './chat/chat.component';
import { NotesComponent } from './notes/notes.component';
import { DetailComponent } from './blog/detail/detail.component';
import { PostComponent } from './blog/post/post.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'course', pathMatch: 'full' },
  { path: 'calender', component: CalendarComponent , canActivate:[AuthGuard] },
  { path: 'contacts', component: ContactComponent , canActivate:[AuthGuard]},
  { path: 'course', component: CourseComponent , canActivate:[AuthGuard]},
  { path: 'chat', component: ChatComponent , canActivate:[AuthGuard]},
  { path: 'employee', component: EmployeeComponent , canActivate:[AuthGuard]},
  { path: 'notes', component: NotesComponent , canActivate:[AuthGuard]},
  { path: 'details', component: DetailComponent , canActivate:[AuthGuard]},
  { path: 'post', component: PostComponent, canActivate:[AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuModuleRoutingModule { }
