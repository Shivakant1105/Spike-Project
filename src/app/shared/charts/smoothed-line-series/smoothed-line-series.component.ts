import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
  selector: 'app-smoothed-line-series',
  templateUrl: './smoothed-line-series.component.html',
  styleUrls: ['./smoothed-line-series.component.scss']
})
export class SmoothedLineSeriesComponent implements OnInit {
  root!: am5.Root;
  constructor() { }

  /**  
    * @description This is a smoothed-line-series.
    * @author Shiva Kant Mishra
    */
  ngOnInit() {

    // Create root element
    this.root = am5.Root.new("chartdiv");
    this.root._logo?.dispose()

    // Set themes
    this.root.setThemes([
      am5themes_Animated.new(this.root)

    ]);

    // Create chart
    let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {}));

    // Create axes
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(this.root, {
      baseInterval: { timeUnit: "day", count: 1 },
      renderer: am5xy.AxisRendererX.new(this.root, {}),
      visible: false
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: am5xy.AxisRendererY.new(this.root, {}),
      visible: false
    }));

    let series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        stroke: am5.color("#3280d7")
      })
    );
    // Apply smoothing for rounded curve
    series.strokes.template.setAll({
      strokeWidth: 2,
    });

    // Set data
    series.data.setAll([
      { date: new Date(2024, 3, 7).getTime(), value: 4000 },
      { date: new Date(2024, 3, 8).getTime(), value: 6000 },
      { date: new Date(2024, 3, 9).getTime(), value: 3000 },
      { date: new Date(2024, 3, 10).getTime(), value: 5000 },
      { date: new Date(2024, 3, 11).getTime(), value: 3500 },
      { date: new Date(2024, 3, 12).getTime(), value: 4500 },
      { date: new Date(2024, 3, 13).getTime(), value: 3000 },

    ]);

    // Hide axis labels
    xAxis.get('renderer').grid.template.setAll({ visible: false });
    yAxis.get('renderer').grid.template.setAll({ visible: false });

  }
}

