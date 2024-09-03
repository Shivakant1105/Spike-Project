import { AfterViewInit, Component, NgZone } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit {
  constructor(private zone: NgZone) {}
  private root: am5.Root | undefined;

  /**
   * @description This is a Pie-Chart
   * @author Vivek Sengar
   */
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      let currentColor: any;
      this.root = am5.Root.new('product');
      this.root._logo!.dispose();
      let chart = this.root.container.children.push(
        am5percent.PieChart.new(this.root, {
          layout: this.root.verticalLayout,
        })
      );

      const colorSet = am5.ColorSet.new(this.root, {
        colors: [
          am5.color('#3280d7'),
          am5.color('#4bc9e9'),
          am5.color('#fb9780'),
        ],
      });

      let series = chart.series.push(
        am5percent.PieSeries.new(this.root, {
          radius: am5.percent(100),
          innerRadius: am5.percent(80),
          valueField: 'value',
          categoryField: 'category',
          colors: colorSet,
        })
      );
      series.data.setAll([
        {
          category: 'First',
          value: 30,
        },
        {
          category: 'Second',
          value: 30,
        },
        {
          category: 'Remaining',
          value: 30,
        },
      ]);
      series.slices.template.events.on('pointerover', function (event) {
        currentColor = event.target.get('fill');
        if (currentColor && !event.target.get('active')) {
          let lightColor = am5.Color.lighten(currentColor, 0.5);
          event.target.set('fill', lightColor);
        }
      });

      series.slices.template.events.on('pointerout', function (event) {
        if (!event.target.get('active')) {
          event.target.set('fill', currentColor);
        }
      });
      series.slices.template.events.on('click', function (ev) {
        const newColors = [
          am5.color('#3280d7'),
          am5.color('#4bc9e9'),
          am5.color('#fb9780'),
        ];
        series.slices.each((slice, index) => {
          if (slice !== ev.target && slice.get('active')) {
            slice.set('active', false);
            slice.set('fill', newColors[index]);
          }
          if (ev.target == slice && slice.get('active')) {
            slice.set('fill', newColors[index]);
          }
          if (slice == ev.target) {
            currentColor = slice.get('fill');
            if (currentColor) {
              const darkColor = am5.Color.lighten(currentColor, -0.5);
              ev.target.set('fill', darkColor);
            }
          }
        });
      });

      series.labels.template.set('visible', false);
      series.ticks.template.set('visible', false);
      series.slices.template.set('tooltipText', '');
    });
  }
}
