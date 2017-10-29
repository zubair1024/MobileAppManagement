import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { Chart } from 'chart.js';
import { AppState } from '../appState';

@inject(Http, AppState)
export class Overview {
  //app
  App = App;
  //loader
  loading = true;
  //bounds
  latlngBounds;
  //persisting the map refresher
  refresher;
  //map controls object
  mapControl = {
    refreshInterval: 20000,
    autoRefresh: true,
    autoPan: true,
    autoZoom: false,
    autoCluster: true
  };
  //model for marker binding
  markers = [];
  //clusterer
  markerCluster;
  //dropped pin
  dropMarker = null;
  //current InfoWindow
  currentInfoWindow;
  //markerSelect
  markerSelect;
  //marker selection array
  markerSelected = [];

  //live operational statistics
  opStatistics = {};

  cards = {};

  constructor(http, appState) {
    this.client = http.client;
    this.appState = appState;
  }

  attached() {
    let me = this;

    // this.renderPowerOutputBar();
    // this.renderliveOperationalStatisticsPie();
    // this.renderMiniAlarms();
    // this.initMap(() => {
    //   //stupid hacky workaround :(
    //   setTimeout(function() {
    //     google.maps.event.trigger(me.googleMap, 'resize');
    //   }, 500);
    //   this.renderAssetMarkers(() => {
    //     //do something more
    //     this.loadingMap = false;
    //   });
    // });
  }

  /**
     * Initialize Map
     * @param {*} callback
     */
  initMap(callback) {
    console.log('initMap');
    // let me = this;
    //create bounds instance
    this.latlngBounds = new google.maps.LatLngBounds();
    //create map instance
    this.googleMap = new google.maps.Map(
      document.getElementById('overviewMap'),
      {
        zoom: 10,
        center: { lat: 25, lng: 55 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        scrollwheel: false,
        draggable: true,
        styles: [
          {
            featureType: 'landscape.natural',
            elementType: 'geometry.fill',
            stylers: [{ visibility: 'on' }, { color: '#e0efef' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [
              { visibility: 'on' },
              { hue: '#1900ff' },
              { color: '#c0e8e8' }
            ]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ lightness: 100 }, { visibility: 'simplified' }]
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { lightness: 700 }]
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#7dcdcd' }]
          }
        ],
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: false,
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
        }
      }
    );

    //render legend
    this.renderLegend(this.googleMap);
    // google.maps.event.addListener(this.googleMap, 'click', function (event) {
    //     //call function to create marker
    //     if (me.dropMarker) {
    //         me.dropMarker.setMap(null);
    //         me.dropMarker = null;
    //     }

    //     me.dropMarker = me.createDropMarker(event.latLng, "name", "<b>Positions</b><br>" + event.latLng);
    // });

    callback();
  }

  /**
  * Render Map Legend
  */
  renderLegend(map) {
    let legend = this.legend;
    legend.innerHTML = `
        <div class='card map-legend'>
          <h7>Legend</h7>
          <ul>
            <li><img src="/images/map/icons/on-sm.png"> ON</li>
            <li><img src="/images/map/icons/off-sm.png"> OFF</li>
            <li><img src="/images/map/icons/alert-sm.png"> Alarmed</li>
            <li><img src="/images/map/icons/maintenance-sm.png"> Maintenance</li>
            <li><img src="/images/map/icons/unknown-sm.png"> Unknown</li>
            <li><img src="/images/map/icons/decommissioned-sm.png"> Decommissioned</li>
          </ul>
        </div>
        `;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
  }

  /**
    * Rendering Asset Markers on Map
    * @param {*} callback
    */
  renderAssetMarkers(callback) {
    let me = this;
    this.loadingMap = true;
    if (this.markerCluster) {
      this.removeCluster();
    }
    //clean up the markers
    this.markers = [];
    //load all assets on map
    this.client.get('/map/assets').then(res => {
      if (res && res.data) {
        console.info('map');
        for (let i = 0; i < res.data.length; i++) {
          let markerInfo = res.data[i];
          let infowindow = new google.maps.InfoWindow({
            content: `
                               <div id="tabstrip">
                            <ul>
                                <li class="k-state-active">
                                    Event Info
                                </li>
                                <li>
                                    Asset Info
                                </li>
                            </ul>
                            <div>
                               <table>
                                        <tbody>
                                            <tr>
                                            <td><b>Name</b></td>
                                            <td><a href='#asset-details/${markerInfo._asset._id}'>${markerInfo._asset.name}</a></td>
                                            </tr>
                                            <tr>
                                            <td><b>Status</b></td>
                                            <td>${markerInfo._asset.status || '-'}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Event Type</b></td>
                                            <td>${markerInfo.eventType}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Event Time</b></td>
                                            <td>${App.util.format.dateTime(markerInfo.eventTime, App.currentUser.dateTimeFormat)}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Position</b></td>
                                            <td>${markerInfo.latitude}, ${markerInfo.longitude}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div>
                            <div>
                                <table>
                                        <tbody>
                                            <tr>
                                            <td><b>Engine Status</b></td>
                                            <td>${markerInfo.engineStatus || '-'}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Engine Hour Meter</b></td>
                                            <td>${markerInfo.engineHourMeter || '-'}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Supply Voltage</b></td>
                                            <td>${markerInfo.powerSupplyVoltage || '-'}</td>
                                            </tr>
                                            <tr>
                                          <td><b>Coolant Temperature</b></td>
                                            <td>${App.util.format.item(markerInfo.engineCoolantTemperature, 'temperature') || '-'}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Oil Pressure</b></td>
                                            <td>${App.util.format.item(markerInfo.oilPressure, 'pressure') || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                                    `
          });

          // asset map icon
          let iconUrl = '/images/map/icons/unknown.png';
          if (
            markerInfo._asset.status && markerInfo._asset.status !== 'Deployed'
          ) {
            switch (markerInfo._asset.status) {
            case 'Maintenance':
              iconUrl = '/images/map/icons/maintenance.png';
              break;

            case 'Decommissioned':
              iconUrl = '/images/map/icons/decommissioned.png';
              break;

            default:
                //do nothing
              break;
            }
          } else {
            if (markerInfo._asset && markerInfo._asset.features.engineStatus) {
              switch (markerInfo._asset.features.engineStatus.value) {
              case 'on':
                iconUrl = '/images/map/icons/on.png';
                break;

              case 'off':
                iconUrl = '/images/map/icons/off.png';
                break;

              default:
                  //do nothing
                break;
              }
            }
          }
          //create marker object
          let marker = new google.maps.Marker({
            position: {
              lat: parseFloat(markerInfo.latitude),
              lng: parseFloat(markerInfo.longitude)
            },
            title: markerInfo.assetName,
            icon: iconUrl,
            map: me.googleMap,
            id: markerInfo.assetName
          });

          //add listener for the map infoWindow click
          marker.addListener('click', function() {
            infowindow.open(me.googleMap, marker);
          });

          google.maps.event.addListener(infowindow, 'domready', function(e) {
            //intialize tabstrips.
            $('#tabstrip').kendoTabStrip({
              animation: {
                open: {
                  effects: 'fadeIn'
                }
              }
            });
            // Reference to the DIV which receives the contents of the infowindow using jQuery
            let iwOuter = $('.gm-style-iw');
            let iwBackground = iwOuter.prev();
            // Remove the background shadow DIV
            iwBackground.children(':nth-child(2)').css({ display: 'none' });
            // Remove the white background DIV
            iwBackground.children(':nth-child(4)').css({ display: 'none' });
          });

          //push the marker to class
          me.markers.push(marker);

          //extend bounds
          me.latlngBounds.extend({
            lat: parseFloat(markerInfo.latitude),
            lng: parseFloat(markerInfo.longitude)
          });
        }

        //auto pan if option is selected
        if (me.mapControl.autoPan) {
          me.autoPan();
        }

        //add clustering
        if (me.mapControl.autoCluster) {
          me.addClusters();
        }

        //return
        callback && callback();
      }
    });
  }

  /**
   * Auto Pan Map to Markers
   */
  autoPan() {
    let len = this.markers.length;
    for (let i = 0; i < len; i++) {
      //extend bounds
      this.markers[i].map && this.latlngBounds.extend(this.markers[i].position);
    }
    //now fit the map to the newly inclusive bounds
    this.googleMap.fitBounds(this.latlngBounds);
  }

  /**
     * Adding clustering
     */
  addClusters() {
    this.markerClusterer = new MarkerClusterer(this.googleMap, this.markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
  }

  /**
   *  Render daily power output bar chart
   */
  renderPowerOutputBar() {
    let dataSource = {};
    let categories = [];
    let series = [];
    this.loadingPowerOutputBar = true;
    this.client
      .get('/statistics/projectUtilization/poweroutputkwdaily')
      .then(res => {
        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            let day = moment(new Date()).format('dddd');
            categories.push(res.data[i]._project.name);
            if (!dataSource[day]) {
              dataSource[day] = [res.data[i].powerOutputKW];
            } else {
              dataSource[day].push(res.data[i].powerOutputKW);
            }
          }
          for (let key in dataSource) {
            series.push({
              name: key,
              data: dataSource[key]
            });
          }

          //render bar chart
          $('#powerOutputBar').kendoChart({
            title: {
              text: 'Daily Output Generated'
            },
            theme: 'material',
            legend: {
              position: 'top'
            },
            seriesDefaults: {
              type: 'column'
            },
            seriesColors: ['#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'],
            series: series,
            valueAxis: {
              labels: {
                format: '{0} kVA'
              },
              line: {
                visible: true
              },
              axisCrossingValue: 0
            },
            categoryAxis: {
              categories: categories,
              line: {
                visible: false
              }
            },
            tooltip: {
              visible: true,
              format: '{0} kVA',
              template: '#= series.name #: #= value # kVA'
            }
          });
          this.loadingPowerOutputBar = false;
        }
      });
  }

  /**
   * Render live operational statistics pie chart
   */
  renderliveOperationalStatisticsPie() {
    let me = this;
    this.loadingliveOperationalStatistics = true;
    this.loadingliveOperationalStatisticsPie = true;
    this.client.get('/statistics/liveoperationalstatistic').then(res => {
      if (res) {
        if (res.data) {
          this.opStatistics = res.data.current;
          this.opStatisticsPrevious = res.data.previous
            ? res.data.previous
            : null;
          //render pie chart
          let ctx = document.getElementById('operationalPie');
          me.cards.liveoperationalstatistics = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Not Operational', 'Operational', 'Unknown'],
              datasets: [
                {
                  data: [
                    me.opStatistics.notOperational,
                    me.opStatistics.operational,
                    me.opStatistics.unknown
                  ],
                  backgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa'],
                  hoverBackgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa']
                }
              ]
            }
          });
        }
      }
      this.loadingliveOperationalStatisticsPie = false;
    });
  }

  /**
   * Render Mini Alarms Widget
   */
  renderMiniAlarms() {
    let config = $.extend(
      true,
      {
        columns: [
          {
            field: '_asset.name',
            title: 'Asset',
            filterable: {
              cell: {
                operator: 'contains'
              }
            },
            template: "<a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a>"
          },
          {
            field: 'name',
            title: 'Alarm',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'triggerDate',
            title: 'Trigger Date',
            template: '#if(triggerTime){# #: App.util.format.dateTime(triggerTime, App.currentUser.dateTimeFormat) # #}#'
          }
        ]
      },
      App.config.grid
    );

    //avoid auto-sizing the columns
    config.dataBound = function() {
      //do nothing
    };

    //remove toolbar
    config.toolbar = null;
    //remove grouping
    config.groupable = false;
    //set the access url
    config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';
    //select the columns
    config.dataSource.transport.read.data = {
      values: 'name,triggerTime,_asset'
    };
    //filter the data
    config.dataSource.filter = [
      {
        field: 'triggered',
        operator: 'eq',
        value: true
      }
    ];

    //render the grid
    this.grid = $('#miniAlarms').kendoGrid(config);
  }

  /**
   * Once dom is deattached
   */
  deattached() {
    console.info('overview deattached');
    // this.stopRefresher();
  }
}
