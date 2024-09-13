import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';

import * as am5 from '@amcharts/amcharts5';
// import am5index from "@amcharts/amcharts5/index";
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

   /**  
    * @description This is a map chart.
    * @author Himmat
    */

  private root!: am5.Root;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {}

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
      let root = am5.Root.new('map');

      root.setThemes([am5themes_Animated.new(root)]);

      if (root._logo) {
        root._logo.dispose();
      }

      // Create the map chart
      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'translateX',
          panY: 'translateY',
          projection: am5map.geoMercator(),
        })
      );

      // Create main polygon series for countries
      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ'],
        })
      );

      //for making too
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name} -',
        tooltipPosition:'pointer',
        toggleKey: 'active',
        interactive: true,
        stroke: am5.color(0x151513),
        strokeWidth: 0.8,
        strokeOpacity: 0.5
      });

      let tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
      });
      
      tooltip.get("background")?.setAll({
        fill: am5.color(0xffffff),
        fillOpacity: 0.8
      });
      
      polygonSeries.set("tooltip", tooltip);

      

      //for the map color
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xdadada),
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0xfbe260),

      });

      polygonSeries.mapPolygons.template.states.create('active', {
        fill: am5.color(0xfbe260),
        
      });


      //add the text on map and don't move on click
      var pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          polygonIdField: "polygonId"
        })
      );
      
      var previousPolygon: am5map.MapPolygon | undefined;

      //add the text on map and don't move on click
      polygonSeries.mapPolygons.template.events.on('click',(e)=>{
        let context:any =  e.target.dataItem?.dataContext;

        if (previousPolygon && previousPolygon != e.target) {
            previousPolygon.set('active', false); 
        }

        if (e.target?.get('active') && e.target?.uid == previousPolygon?.uid) {
          e.target.set('active',false) 
        }
      
        let labelData = [{
            polygonId: context.id,
            name: context.name
          }];

        pointSeries.data.setAll(labelData)

        previousPolygon=e.target

      })

      pointSeries.bullets.push(function() {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            fontSize: 20,
            centerX: am5.p50,
            centerY: am5.p50,
            text: "{name}",
            populateText: true,
            fill:am5.color(0x994d20)
          })
        });
      });

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
