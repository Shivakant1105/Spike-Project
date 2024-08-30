import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

const declared = [
  HeaderComponent,
  SidebarComponent,
]
@NgModule({
  declarations: [
    ...declared
  ],
  imports: [
    CommonModule,
    RouterModule,
    FeatherModule.pick(allIcons)
  ],
  exports: [
    ...declared
  ]
})
export class SharedModule { }
