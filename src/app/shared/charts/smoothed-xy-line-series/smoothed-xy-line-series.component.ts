import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'app-smoothed-xy-line-series',
  templateUrl: './smoothed-xy-line-series.component.html',
  styleUrls: ['./smoothed-xy-line-series.component.scss'],
})
export class SmoothedXYLineSeriesComponent implements OnInit {
  private root!: am5.Root | undefined;
  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    let root = am5.Root.new('chartdiv');
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        maxTooltipDistance: -1,
      })
    );

    let data = [
      { day: 'Mon', value: 0, value2: 0 },
      { day: 'Tues', value: 12000, value2: 20000 },
      { day: 'Wed', value: 19000, value2: 15000 },
      { day: 'Thurs', value: 13000, value2: 19000 },
      { day: 'Fri', value: 26000, value2: 14000 },
      { day: 'Sat', value: 16000, value2: 25000 },
      { day: 'Sun', value: 25000, value2: 32000 },
    ];
    // X-axis
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'day',
        startLocation: 0.5,
        endLocation: 0.5,
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let xRenderer = xAxis.get('renderer');
    xRenderer.grid.template.setAll({
      location: 0.5,
    });

    xAxis.data.setAll([
      { day: 'Mon' },
      { day: 'Tues' },
      { day: 'Wed' },
      { day: 'Thurs' },
      { day: 'Fri' },
      { day: 'Sat' },
      { day: 'Sun' },
    ]);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0, // Start from 0
        max: 35000, // End at 35000
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 20,
        }),
      })
    );

    function createSeries(name: any, field: any) {
      var series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: 'day',
          tooltip: am5.Tooltip.new(root, {
            getFillFromSprite: false,
            autoTextColor: false,
            background: am5.Rectangle.new(root, {
              fill: am5.color(0x000000), // Tooltip background color
              fillOpacity: 0.6, // Tooltip background opacity
            }),
          }),
        })
      );

      series.strokes.template.set('strokeWidth', 3);

      root.numberFormatter.set('numberFormat', '#a');

      // Add tooltip text formatting
      series
        .get('tooltip')
        ?.label.adapters.add('text', function (text, _target) {
          text = '';
          var i = 0;
          chart.series.each(function (series) {
            var tooltipDataItem = series.get('tooltipDataItem');
            if (tooltipDataItem) {
              let valueY = tooltipDataItem.get('valueY');
              let categoryX = tooltipDataItem.get('categoryX');
              if (i === 0) {
                text += categoryX + '\n';
              }

              let formattedValueY = root.numberFormatter.format(
                valueY ?? 0,
                '#a'
              );
              text +=
                '[' +
                series.get('stroke')?.toString() +
                ']●[/]' +
                formattedValueY +
                '[/]\n';
            }
            i++;
          });
          return text;
        });

      // Set lineHeight and other styles directly on tooltip label
      series.get('tooltip')?.label.setAll({
        lineHeight: 1.5,
      });
      var tooltipBullet = chart.plotContainer.children.push(
        am5.Circle.new(root, {
          radius: 5,
          fill: series.get('fill'),
          x: -1000,
        })
      );

      var tooltipBullet1 = chart.plotContainer.children.push(
        am5.Circle.new(root, {
          radius: 5,
          fill: series.get('fill'),
          x: -1000,
        })
      );

      series.on('tooltipDataItem', function (tooltipDataItem) {
        var x = -1000;
        var y = -1000;
        if (tooltipDataItem) {
          var point = tooltipDataItem.get('point');
          if (point) {
            x = point.x;
            y = point.y;
          }
        }

        tooltipBullet.setAll({
          x: x,
          y: y,
        });
      });

      series.on('tooltipDataItem', function (tooltipDataItem) {
        var x = -1000;
        var y = -1000;
        if (tooltipDataItem) {
          var point = tooltipDataItem.get('point');
          if (point) {
            x = point.x;
            y = point.y;
          }
        }

        tooltipBullet1.setAll({
          x: x,
          y: y,
        });
      });

      series.data.setAll(data);
    }

    // Add cursor
    chart.set('cursor', am5xy.XYCursor.new(root, {}));
    createSeries('value', 'value');
    createSeries('value2', 'value2');
  }

  // Create series
  ngOnDestroy(): void {
    // Dispose of chart instance when the component is destroyed
    if (this.root) {
      this.root.dispose();
    }
  }
}
