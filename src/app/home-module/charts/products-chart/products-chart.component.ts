import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';

@Component({
  selector: 'app-products-chart',
  templateUrl: './products-chart.component.html',
  styleUrls: ['./products-chart.component.scss']
})
export class ProductsChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let productsRoot = am5.Root.new('product');
    let productChart = productsRoot.container.children.push(
      am5percent.PieChart.new(productsRoot, {
        layout: productsRoot.verticalLayout,
      })
    );
    let productSeries = productChart.series.push(
      am5percent.PieSeries.new(productsRoot, {
        radius: am5.percent(100),
        innerRadius: am5.percent(80),
        valueField: 'value',
        categoryField: 'category',
      })
    );
    productsRoot._logo!.dispose();
    productSeries.labels.template.set('visible', false);
    productSeries.ticks.template.set('visible', false);
    productSeries.slices.template.set('tooltipText', '');
    productSeries.slices.template.states.create('active', {
      shiftRadius: 0,
    });
    //  ProductData
    productSeries.data.setAll([
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
      {
        category: 'vivek',
        value: 30,
      },
    ]);
  }

}
