import { inject } from 'aurelia-framework';
import { Http } from '../http';

import { Chart } from 'chart.js';

@inject(Http)
export class AssetDetails {
  loading = true;
  http;
  model = {};
  poller;

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

  pieChart;

  stats = {
    controls: {
      averagePowerOutput: false,
      averageFuelConsumed: false
    },
    averagePowerOutput: '43 kVA/Hr',
    averageFuelConsumed: '5 L/Hr',
    data: {
      averagePowerOutput: {
        false: '43 kVA/Hr',
        true: '282 kVA/Day'
      },
      averageFuelConsumed: {
        false: '5 L/Hr',
        true: '40 L/Day'
      }
    }
  };

  constructor(http) {
    App.currentView = this;
    this.http = http;
  }

  activate(params) {
    if (params && params.id) {
      this.getAsset(params.id, () => {
        this.loading = false;
        this.deferred();
      });
    }
  }

  attached() {
    //for menu tab
    $('#tabstrip').kendoTabStrip({
      animation: {
        open: {
          effects: 'fadeIn'
        }
      }
    });

    //collapsible
    $('.collapsible').collapsible();

    //set command status
    this.setCommandStatuses();
  }

  /**
     * Get the asset model
     * @param {*} id Asset _id
     */
  getAsset(id, callback) {
    this.http.client.get(`/asset/id/${id}`).then(res => {
      if (res && res.data) {
        this.model = res.data[0];
        callback();
      }
    });
  }

  deferred() {
    let me = this;

    this.renderLine();
    this.renderFuelLevelGauge();

    //start the poller


    this.initMap(() => {
      //stupid hacky workaround :(
      setTimeout( () => {
        google.maps.event.trigger(me.googleMap, 'resize');
      }, 500);
      //for demo let's not do this
      this.renderAssetMarker(() => { });
    });
  }

  /**
   * Initialize Map
   * @param {*} callback
   */
  initMap(callback) {
    console.log('initMap');

    //create bounds instance
    this.latlngBounds = new google.maps.LatLngBounds();
    //create map instance
    this.googleMap = new google.maps.Map(
      document.getElementById('assetOverviewMap'),
      {
        zoom: 3,
        center: { lat: 25, lng: 55 },
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        scrollwheel: true,
        draggable: true,
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
  renderAssetMarker(callback) {
    let me = this;
    if (this.markerCluster) {
      this.removeCluster();
    }
    //clean up the markers
    this.markers = [];
    //load all assets on map
    this.http.client.get(`/map/assets/?ids=${this.model._id}`).then(res => {
      if (res) {
        for (let i = 0; i < res.data.length; i++) {
          let markerInfo = res.data[i];
          let infowindow = new google.maps.InfoWindow({
            content: `
                            <div id="map-tabstrip">
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
            id: markerInfo._id
          });

          //add listener for the map infoWindow click
          marker.addListener('click', function() {
            infowindow.open(me.googleMap, marker);
          });

          google.maps.event.addListener(infowindow, 'domready', function(e) {
            //intialize tabstrips.
            $('#map-tabstrip').kendoTabStrip({
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

  renderChart() {
    let ctx = document.getElementById('myChart');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      }

      // options: options
    });
  }

  renderLine() {
    let canvas = document.getElementById('powerOutputLine');
    let data = {
      labels: [],
      datasets: [
        {
          label: 'Power Output in kVA',
          fill: true,
          fillColor: '#fff',
          bodyFontColor: '#fff',
          lineTension: 0.3,
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
          data: []
        }
      ]
    };

    function adddata() {
      myLineChart.data.datasets[0].data.push(
        Math.floor(Math.random() * 10) + 35
      );
      myLineChart.data.labels.push(
        moment(new Date()).format('DD/M/YYYY h:mm:ss a')
      );
      myLineChart.update();
    }

    let option = {
      showLines: true,
      legend: { labels: { fontColor: 'white' } },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontColor: 'white'
            }
          }
        ]
      }
    };
    let myLineChart = Chart.Line(canvas, {
      data: data,
      options: option
    });

    setInterval(() => {
      adddata();
    }, 10000);
  }

  /**
   * Render Asset Event History Grid
   */
  renderEvents() {
    let me = this;
    //set columns for the grid
    let config = $.extend(
      true,
      {
        height: 700,
        columns: [
          {
            field: 'eventType',
            title: 'Event Type',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'eventTime',
            title: 'Event Time',
            template: "#: App.util.format.dateTime(data.eventTime, App.currentUser.dateTimeFormat)|| '-' #",
            filterable: {
              extra: 'true',
              messages: {
                info: 'Show items between dates:'
              }
            }
          },
          {
            field: 'createdTime',
            title: 'Created Time',
            template: "#: App.util.format.dateTime(data.createdTime, App.currentUser.dateTimeFormat)|| '-' #",
            filterable: {
              extra: 'true',
              messages: {
                info: 'Show items between dates:'
              }
            }
            // hidden: true
          },
          {
            field: 'latitude',
            title: 'Latitude'

            // width: 100
          },
          {
            field: 'longitude',
            title: 'Longitude'

            // width: 100
          },
          {
            field: 'payload',
            title: 'Payload',
            width: 100,
            hidden: true
          },
          {
            field: 'engineHourMeter',
            title: 'Engine Hour Meter'

            // width: 150
          },
          {
            field: 'powerOutputKW',
            title: 'Power Output In KW'

            // width: 150
          },
          {
            field: 'engineCoolantTemperature',
            title: 'Engine Coolant Temperature',
            template: "#: App.util.format.item(data.engineCoolantTemperature,\"temperature\", true)|| '-' #"

            // width: 150
          },
          {
            field: 'engineFrequency',
            title: 'Engine Frequency'

            // width: 150
          },
          {
            field: 'averageLineToLineVoltage',
            title: 'Average Line To Line Voltage'

            // width: 150
          },
          {
            field: 'averageLineToNeutralVoltage',
            title: 'Average Line To Neutral Voltage'

            // width: 150
          },
          {
            field: 'averageAcRmsCurrent',
            title: 'Average Ac Rms Current'

            // width: 150
          },
          {
            field: 'phaseBCurrent',
            title: 'Phase B Current'

            // width: 150
          },
          {
            field: 'phaseCCurrent',
            title: 'Phase C Current'

            // width: 150
          },
          {
            field: 'oilPressure',
            title: 'Oil Pressure',
            template: "# App.util.format.item(data.oilPressure,\"pressure\", true)|| '-' #"

            // width: 150
          },
          {
            field: 'averageFuelConsumptionnRate',
            title: 'Fuel Consumption Rate'

            // width: 150
          },
          {
            field: 'fuelUsed',
            title: 'fuel Used',
            template: "# App.util.format.item(data.fuelUsed,\"volume\", true)|| '-' #"

            // width: 150
          },
          {
            field: 'currentFuelLevel',

            title: 'Fuel Level',

            template: "#: App.util.format.item(data.currentFuelLevel,\"volume\") || '-' #"

            // width: 150
          }
        ]
      },
      App.config.grid
    );

    //set the access url
    config.dataSource.transport.read.url =
      App.config.apiUrl + '/sensormessageevent';
    //filter the data
    config.dataSource.filter = [
      {
        field: '_asset',
        operator: 'eq',
        value: me.model._id
      }
    ];

    //render the grid
    this.grid = $('#eventGrid').kendoGrid(config);
  }
  /**
   * render asset alarms for asset with controls
   */
  renderAssetAlarms() {
    let me = this;
    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          { field: '_asset.name', title: 'Asset' },
          { field: 'name', title: 'Alarm' },
          {
            field: 'triggerDate',
            title: 'Trigger Date',
            template: '#:App.util.format.dateTime(data.triggerTime, App.currentUser.dateTimeFormat) #'
          },
          {
            command: { text: 'Reset', click: me.acknowledgeAlarm },
            title: 'Command',
            width: '100px'
          }
        ]
      },
      App.config.grid
    );

    //set the access url
    config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';
    //filter the data
    config.dataSource.filter = [
      {
        field: '_asset',
        operator: 'eq',
        value: me.model._id
      },
      {
        field: 'triggered',
        operator: 'eq',
        value: true
      }
    ];

    //render the grid
    this.grid = $(this.assetAlarms).kendoGrid(config);
  }

  /**
  * Acknowledge alarm
  * @param {*} e an click event on the grid
  */
  acknowledgeAlarm(e) {
    e.preventDefault();

    let dataItem = this.dataItem($(e.currentTarget).closest('tr'));

    kendo.prompt('Please, enter a comment', '').then(
      function(data) {
        $.ajax({
          method: 'PUT',
          url: App.config.apiUrl + '/alarm/reset',
          data: { _id: dataItem._id, msg: data, alarm: dataItem.toJSON() },
          success: function(res) {
            kendo.alert('Acknowledgement sucessful');
            //re-render the active alarms grid
            App.currentView.renderAssetAlarms();
          },
          error: function(err) {
            me.renderAssetAlarms();
          }
        });
      },
      function() {
        kendo.alert('Acknowledgement cancelled');
      }
    );
  }

  toggleStats(str) {
    this.stats.controls[str] = !this.stats.controls[str];
    this.stats[str] = this.stats.data[str][this.stats.controls[str]];
  }

  renderFuelLevelGauge() {
    $('#gauge').kendoRadialGauge({
      theme: 'material',
      pointer: {
        value: App.util.format.item(64, 'volume')
      },
      scale: {
        minorUnit: 5,
        startAngle: -30,
        endAngle: 210,
        labels: {
          // labels template
          template: "#= App.util.format.item(value,'volume') #%"
        },
        max: 100,
        ranges: [
          {
            from: 0,
            to: 20,
            color: '#ff3d00'
          },
          {
            from: 20,
            to: 50,
            color: '#ffff00'
          },
          {
            from: 50,
            to: 100,
            color: '#00c853'
          }
        ]
      }
    });
  }

  // acknowledgeAlarm() {
  //   let dialog = $('#acknowledgeDialog');
  //   if (dialog.data('kendoDialog')) {
  //     dialog.data('kendoDialog').open();
  //   } else {
  //     dialog.kendoDialog({
  //       width: '400px',
  //       title: 'Acknowledge Alarm',
  //       closable: true,
  //       modal: false,
  //       content: `
  //           <p>Are you sure you want to acknowledge this alarm?</p>
  //           `,
  //       actions: [{ text: 'Acknowledge', primary: true }, { text: 'Cancel' }],
  //       close: onClose
  //     });
  //   }
  //   function onClose() {
  //     // undo.fadeIn();
  //   }
  // }

  commands = {
    remoteStartStop: {
      status: 'ON',
      timestamp: '6/5/2017 04:31:33 am'
    },
    ping: {
      timestamp: '1/4/2017 04:31:33 am'
    }
  };

  remotePingCommand() {
    this.commands.ping.timestamp = moment(Date()).format('DD/M/YYYY h:mm:ss a');
  }

  setCommandStatuses() {
    if (this.commands.remoteStartStop.status === 'ON') {
      $(this.remoteStart).addClass('disabled');
    } else {
      $(this.remoteStop).addClass('disabled');
    }
  }

  /**
   * Remote Stop Command
   */
  sendRemoteCommand(cmd) {
    let me = this;
    if (me.model) {
      this.http.client.post('/asset/command', {
        imei: me.model.sensor,
        command: cmd,
        interfaceType: me.model.interfaceType
      }).then((res) => {
        if (res) {
          console.log(res);
          Materialize.toast(res.message, 5000);
        }
      });
    }
  }
}
