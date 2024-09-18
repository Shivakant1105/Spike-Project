import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterModule } from "@angular/router";
import { SmoothedLineSeriesComponent } from "./charts/smoothed-line-series/smoothed-line-series.component";
import { PieChartComponent } from "./charts/pie-chart/pie-chart.component";
import { MapComponent } from "./charts/map/map.component";
import { PaymentsComponent } from "./charts/payments/payments.component";

const declared = [
  HeaderComponent,
  SidebarComponent,
  SmoothedLineSeriesComponent,
  PieChartComponent,
  MapComponent,
  PaymentsComponent,
];

@NgModule({
  declarations: [...declared],
  imports: [CommonModule, RouterModule, FeatherModule.pick(allIcons)],
  exports: [...declared],
})
export class SharedModule {}
