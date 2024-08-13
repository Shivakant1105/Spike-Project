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


@NgModule({
  declarations: [
    ContactComponent,
    CalendarComponent,
    CourseComponent,
    EmployeeComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    MenuModuleRoutingModule,
    FeatherModule.pick(allIcons)
  ]
})
export class MenuModuleModule { }
