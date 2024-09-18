import { AfterViewInit, Component, OnInit } from '@angular/core';

import { Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit,AfterViewInit {

   /**  
    * @description This is a payments chart.
    * @author Jagdish
    */


  private root!: am5.Root;
  public payPalPercentage!:number;
  public creditCardPercentage!:number

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {}

  ngOnInit(): void {}
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      var root = am5.Root.new('payments');

      if (root._logo) {
        root._logo.dispose();
      }
      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout,
          paddingLeft:0,
          paddingRight:0
        })
      );

      // Add legend
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.verticalLayout,
          clickTarget: 'none',
        })
      );

      var data = [
        {
          category: '',
        },
        {
          category: 'M',
          s10: 9,
          s11: 12,
        },
        {
          category: 'T',
          s10: 15,
          s11: 8,
        },
        {
          category: 'W',
          s10: 10,
          s11: 10,
        },
        {
          category: ' T',
          s10: 12,
          s11: 12,
        },
        {
          category: 'F',
          s10: 15,
          s11: 8,
        },
        {
          category: 'S',
          s10: 12,
          s11: 16,
        },
        {
          category: ' S',
          s10: 9,
          s11: 12,
        },
        {
          category: '',
        },
      ];

      function findPercentage(part: any, total: any) {
        if (total === 0) {
          throw new Error('Total cannot be zero');
        }
        return (part / total) * 100;
      }

      // Create axes
      var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'category',
          renderer: am5xy.AxisRendererX.new(root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minGridDistance: 10,
            visible: false,
          }),
          tooltip: am5.Tooltip.new(root, {}),
        })
      );


      xAxis.get('renderer').grid.template.set('forceHidden', true);

      xAxis.data.setAll(data);

      var yRenderer = am5xy.AxisRendererY.new(root, {});

      yRenderer.labels.template.set('visible', false);


      // Create Y-axis

      var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: yRenderer,
        })
      );


      // Add series

        xAxis.get('renderer').grid.template?.setAll({
          
          
        });

      //remove horizontal line
      yAxis.get('renderer').grid.template.setAll({
        strokeWidth: 0,
        visible: false,
        
      });

      xAxis.get('renderer').grid.template.setAll({
        location: 0,
        strokeWidth: 0,
        visible: false,
      });


      function makeSeries(
        name: string,
        key: string,
        fieldName: string,
        color: am5.Color,
        spacing: number,
      ) {
        var series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            stacked: true,
            valueYField: fieldName,
            categoryXField: 'category',
            stroke: color,
            fill: color,
          })
        );

        series.columns.template.setAll({
          width: am5.percent(40),
          tooltipY: 0,
          cornerRadiusTL: 50,
          cornerRadiusTR: 50,
          cornerRadiusBL: 50,
          cornerRadiusBR: 50,
        });

        // setting hower effect on particular series
        // Set opacity change on hover for the "Credit Card" series

        let prev!: any;
        let curr!: any;

        if (key === 'Paypal') {
          series.columns.template.events.on('pointerover', function (event:any) {
            if(prev == null || prev == undefined){
              event.target.set('opacity', 0.5);
            }
            if(prev && !prev.isActive){
              event.target.set('opacity', 0.5);
            }

            if(prev && prev.isActive && prev.target.uid != event.target.uid){
              event.target.set('opacity', 0.5);
            }
          });


          series.columns.template.events.on('pointerout', function (event) {
            event.target.set('opacity', 1);
          });

          series.columns.template.events.on('click', (event:any) => {
            
            if (!prev) {
              
              curr = event;

              let originalColor: any = curr.target.get('fill');
              let darkerColor = am5.Color.lighten(originalColor, -0.2);
              event.target.set('fill', darkerColor);
              event.isActive = true;
              prev = event;
            } else {
              let originalColor: any = event.target.get('fill');
              prev.target.set('fill', originalColor);
              curr = event;
              let originalColor2: any = curr.target.get('fill');
              let darkerColor:any;
              
              if(prev.target.uid != curr.target.uid){
               darkerColor = am5.Color.lighten(originalColor2, -0.2);
               curr.isActive = true;
              }else if(!prev.isActive == !curr.isActive){
                darkerColor = am5.Color.lighten(originalColor2, -0.2);
                curr.isActive = true;
              }else{
                darkerColor = am5.color(0x00c0ff);
                curr.isActive = false;
                
              }
              curr.target.set('fill', darkerColor);
              prev = curr;
            }
          });
        }

        if (key === 'Credit Card') {
          series.columns.template.events.on('pointerover', function (event) {
            if(prev == null || prev == undefined){
              event.target.set('opacity', 0);
            }
            if(prev && !prev.isActive){
              event.target.set('opacity', 0);
            }

            if(prev && prev.isActive && prev.target.uid != event.target.uid){
              event.target.set('opacity', 0);
            }
          });
          series.columns.template.events.on('pointerout', function (event) {
            event.target.set('opacity', 1);
          });

          series.columns.template.events.on('click', (event:any) => {

            if (!prev) {
              curr = event;

              let originalColor: any = curr.target.get('fill');
              let darkerColor = am5.Color.lighten(originalColor, -0.2);
              event.target.set('fill', darkerColor);
              event.isActive = true;
              prev = event;
            } else {
              let originalColor: any = event.target.get('fill');
              prev.target.set('fill', originalColor);
              curr = event;
              let originalColor2: any = curr.target.get('fill');
              let darkerColor:any;
              
              if(prev.target.uid != curr.target.uid){
               darkerColor = am5.Color.lighten(originalColor2, -0.2);
               curr.isActive = true;
              }else if(!prev.isActive == !curr.isActive){
                darkerColor = am5.Color.lighten(originalColor2, -0.2);
                curr.isActive = true;
              }else{
                darkerColor = am5.color(0xebeff2);
                curr.isActive = false;
                
              }
              curr.target.set('fill', darkerColor);
              prev = curr;
            }
          });
          
        }

        // spacing between series !! 
        series.columns.template.adapters.add('y', function (y, target) {
          if (target.dataItem && target.dataItem.component === series) {
            return (
              (y as any) + series.dataItems.indexOf(target.dataItem) * spacing
            );
          }
          return y;
        });


        series.data.setAll(data);
        series.appear();

        legend.markerRectangles.template.setAll({
          cornerRadiusTL: 100,
          cornerRadiusTR: 100,
          cornerRadiusBL: 100,
          cornerRadiusBR: 100,
        });

      }

      let s1 = 0;
      let s2 = 0;
      let total = 0;
      data.forEach(({ s10, s11 }) => {
        if (s10 && s11) {
          s1 += s10 as any;
          s2 += s11 as any;
          total = total + s10 + s11;
        }
      });
      this.payPalPercentage = Math.round(findPercentage(s1,total))
      this.creditCardPercentage = Math.round(findPercentage(s2,total))

      
      makeSeries(
        `Paypal ${Math.round(findPercentage(s1, total))}%`,
        'Paypal',
        's10',
        am5.color(0x00c0ff),
        0
      );
      makeSeries(
        `Credit Card ${Math.round(findPercentage(s2, total))}%`,
        'Credit Card',
        's11',
        am5.color(0xebeff2),
        -1
      );

      // Make stuff animate on load
      chart.appear(1000, 100);
    });
  }
  
  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
