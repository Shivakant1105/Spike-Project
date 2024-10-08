import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeModuleRoutingModule } from './home-module-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SharedModule } from '../shared/shared.module';

import { AccountSettingComponent } from '../menu-module/account-setting/account-setting.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, AccountSettingComponent],
  imports: [
    CommonModule,
    HomeModuleRoutingModule,
    FeatherModule.pick(allIcons),
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class HomeModuleModule {}
