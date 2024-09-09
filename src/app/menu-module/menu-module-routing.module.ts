import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ContactComponent } from './contact/contact.component';
import { CourseComponent } from './course/course.component';
import { EmployeeComponent } from './employee/employee.component';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './blog/post/post.component';
import { DetailComponent } from './blog/detail/detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'course', pathMatch: 'full' },
  { path: 'calender', component: CalendarComponent },
  { path: 'contacts', component: ContactComponent },
  { path: 'course', component: CourseComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'post', component: PostComponent },
  { path: 'detail', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuModuleRoutingModule {}
