import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeModuleRoutingModule } from './home-module-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SharedModule } from '../shared/shared.module';
import { PaymentsChartComponent } from './charts/payments-chart/payments-chart.component';
import { ProductsChartComponent } from './charts/products-chart/products-chart.component';
import { OrdersChartComponent } from './charts/orders-chart/orders-chart.component';
import { DealChartComponent } from './charts/deal-chart/deal-chart.component';
import { CustomersChartComponent } from './charts/customers-chart/customers-chart.component';
import { MapChartComponent } from './charts/map-chart/map-chart.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PaymentsChartComponent,
    ProductsChartComponent,
    OrdersChartComponent,
    DealChartComponent,
    CustomersChartComponent,
    MapChartComponent,
    AccountSettingComponent,
  ],
  imports: [
    CommonModule,
    HomeModuleRoutingModule,
    FeatherModule.pick(allIcons),
    SharedModule,
  ],
})
export class HomeModuleModule {}
