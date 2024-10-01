import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { SmoothedLineSeriesComponent } from './charts/smoothed-line-series/smoothed-line-series.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { MapComponent } from './charts/map/map.component';
import { PaymentsComponent } from './charts/payments/payments.component';
import { LoaderComponent } from './loader/loader.component';
import { GridTableComponent } from './grid-table/grid-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { SmoothedXYLineSeriesComponent } from './charts/smoothed-xy-line-series/smoothed-xy-line-series.component';
import { ButtonRendererComponent } from './cell-renderer/button-renderer/button-renderer.component';
import { MultiValRendererComponent } from './cell-renderer/multi-val-renderer/multi-val-renderer.component';

const declared = [
  HeaderComponent,
  SidebarComponent,
  SmoothedLineSeriesComponent,
  PieChartComponent,
  MapComponent,
  PaymentsComponent,
  LoaderComponent,
  GridTableComponent,
  SmoothedXYLineSeriesComponent,
];

@NgModule({
  declarations: [
    ...declared,
    ButtonRendererComponent,
    MultiValRendererComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AgGridModule,

    FeatherModule.pick(allIcons),
  ],
  exports: [...declared],
})
export class SharedModule {}
