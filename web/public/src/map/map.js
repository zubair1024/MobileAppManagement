import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class Map {
  loading = true;
  locationCreation = false;
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

  //locations
  locationMarkers = [];

  //geofences
  geofenceMarkers = [];

  //new Location
  newLocation = {};

  constructor(http) {
    this.client = http.client;
  }

  /**
     * Component attached to DOM
     */
  attached() {
    App.currentView = this;
    let me = this;

    this.loading = false;
    $('ul.tabs').tabs();


    //collapsible
    $('.collapsible').collapsible();

    //location types
    $(this.locationTypes).kendoDropDownList({
      dataSource: App.config.locationTypes,
      // index: 0,
      change: function() {
        //set the changed value
        me.newLocation.type = this.value();
      }
    });

    //geofence types
    $(this.geofenceTypes).kendoDropDownList({
      dataSource: App.config.geofenceTypes,
      // index: 0,
      change: function() {
        //set the changed value
        me.newGeofence.type = this.value();
      }
    });


    //asset list multiselect
    $(this.geofenceLocation).kendoMultiSelect({
      placeholder: 'Search...',
      dataTextField: 'name',
      dataValueField: '_id',
      maxSelectedItems: 1,
      ignoreCase: false,
      filter: 'contains',
      // minLength: 3,
      dataSource: {
        type: 'odata',
        serverFiltering: true,
        transport: {
          read: {
            type: 'GET',
            contentType: 'application/json',
            accept: 'application/json, text/plain, */*',
            dataType: 'json',
            xhrFields: { withCredentials: true },
            url: App.config.apiUrl + '/misc/find/location'
          }
        }
      },
      select: function(e) {
        //navigate to object
        if (e.dataItem._id) {
          me.newGeofence._location = e.dataItem._id;
        }
      },
      deselect: function(e) {
        //navigate to object
        me.newGeofence._location =  null;
      }

      //  value: []
    });

    //get asset markers
    this.initMap(() => {
      //stupid hacky workaround :(
      setTimeout(function() {
        google.maps.event.trigger(me.googleMap, 'resize');
      }, 200);

      //render tabs for asset marker infowindow
      this.renderAssetMarkers(() => {
        $('ul.tabs').tabs();

        //create marker select box
        this.initMarkerSelect();

        //load locations tree
        this.renderLocationsTree();

        //load geofences tree
        this.renderGeofencesTree();
      });
    });
  }

  /**
     * Initialize Map
     * @param {*} callback
     */
  initMap(callback) {
    console.log('initMap');
    let me = this;
    //create bounds instance
    this.latlngBounds = new google.maps.LatLngBounds();
    //create map instance
    App.googleMap = this.googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: { lat: 25, lng: 55 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
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
    });

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
     * Initialize the Marker Select Control
     */
  initMarkerSelect() {
    let dataSource = [];
    for (let i = 0; i < this.markers.length; i++) {
      let marker = this.markers[i];
      dataSource.push({
        id: marker.id
      });
    }

    this.markerSelect = $('#markerSelect')
      .kendoMultiSelect({
        autoClose: false,
        dataSource: dataSource,
        dataTextField: 'id',
        dataValueField: 'id'
      })
      .data('kendoMultiSelect');
  }

  /**
     * Rendering Asset Markers on Map
     * @param {*} callback
     */
  renderAssetMarkers(callback) {
    let me = this;
    if (this.markerCluster) {
      this.removeCluster();
      this.markerClusterer.clearMarkers();
    }
    //clean up the markers
    this.removeMarkers();
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
            id: markerInfo._asset.name
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
   * Remove Asset Markers
   */
  removeMarkers() {
    let markers = this.markers;

    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  // A function to create the marker and set up the event window function
  createDropMarker(latlng, name, html) {
    // let infowindow = new google.maps.InfoWindow({
    //   size: new google.maps.Size(150, 50)
    // });

    // let contentString = html;
    let marker = new google.maps.Marker({
      position: latlng,
      icon: '/images/map/icons/dropmarker.png',
      map: this.googleMap,
      zIndex: Math.round(latlng.lat() * -100000) << 5
    });

    // google.maps.event.addListener(marker, 'click', function() {
    //   infowindow.setContent(contentString);
    //   infowindow.open(this.googleMap, marker);
    // });
    // google.maps.event.trigger(marker, 'click');
    return marker;
  }

  /**
   * Start Map Refresher
   */
  startRefresher() {
    console.info('map refresher started');
    this.refresher = setInterval(() => {
      this.getAssetMarkers(null);
    }, this.mapControl.refreshInterval);
  }

  /**
     * Stop Map Refresher
     */
  stopRefresher() {
    console.info('map refresher stopped');
    clearInterval(this.refresher);
  }

  /**
      * Toggle Refresher
      * @param e Event Element
      */
  toggleRefresher(e) {
    if (e.srcElement.checked) {
      this.startRefresher();
    } else {
      this.stopRefresher();
    }
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
     * Remove marker clustering
     */
  removeCluster() {
    this.markerClusterer.clearMarkers();
    this.renderAssetMarkers(() => {});
  }

  /**
     * Toggle Clusterer
     * @param e Event Element
     */
  toggleClusterer(e) {
    if (e.srcElement.checked) {
      this.addClusters();
    } else {
      this.removeCluster();
    }
  }

  filterMarkers() {
    this.removeMarkers();
    this.markerClusterer.clearMarkers();
    let selectedValues = this.markerSelect.value();

    if (selectedValues && selectedValues.length > 0) {
      let selectedLen = selectedValues.length;
      let markersLen = this.markers.length;

      this.markerSelected = [];

      for (let i = 0; i < selectedLen; i++) {
        for (let j = 0; j < markersLen; j++) {
          if (selectedValues[i] === this.markers[j].id) {
            this.markerSelected.push(this.markers[j]);

            //set missing markers back
            if (!this.markers[j].getMap()) {
              this.markers[j].setMap(this.googleMap);
            }
          }
        }
      }
      this.autoPan();
      this.mapControl.autoRefresh = false;
    } else {
      this.renderAssetMarkers();
    }
  }

  /**
   * Location selection handler (checkbox)
   */
  selectGeofence() {
    let geofencesToShow = [];
    let grid = $('#geofence-tree').data('kendoGrid');
    let ds = grid.dataSource.view();

    //select locations to display
    for (let i = 0; i < ds.length; i++) {
      for (let j = 0; j < ds[i].items.length; j++) {
        let row = grid.table.find("tr[data-uid='" + ds[i].items[j].uid + "']");
        let checkbox = $(row).find('.geofence-node');
        if (checkbox.is(':checked')) {
          geofencesToShow.push(ds[i].items[j]);
        }
      }
    }

    if (geofencesToShow.length) {
      this.showGeofences(geofencesToShow);
    } else {
      this.removeGeofences();
    }
  }


  /**
   * Show selected locations
   */
  showGeofences(geofences) {
    console.log('geofences: ', geofences);
    let me = this;

    this.removeGeofences();

      //loop and show all selected geofences
    for (let i = 0; i < geofences.length; i++) {
      this.renderGeofence(geofences[i]);
    }


    //loop and show all selected locations
    // for (let i = 0; i < locations.length; i++) {
    //   let markerInfo = locations[i];
    //   //create marker object
    //   let marker = new google.maps.Marker({
    //     position: {
    //       lat: parseFloat(markerInfo.latitude),
    //       lng: parseFloat(markerInfo.longitude)
    //     },
    //     title: markerInfo.name,
    //     icon: `/images/map/locations/${markerInfo.type}.png`,
    //     map: me.googleMap,
    //     id: markerInfo._id
    //   });

    //   let infowindow = new google.maps.InfoWindow({
    //     content: `
    //                            <div id="tabstrip">
    //                         <ul>
    //                             <li class="k-state-active">
    //                                 Location Info
    //                             </li>
    //                         </ul>
    //                         <div>
    //                            <table>
    //                                     <tbody>
    //                                         <tr>
    //                                         <td><b>Name</b></td>
    //                                         <td>${markerInfo.name}${i}</td>
    //                                         </tr>
    //                                         <tr>
    //                                         <td><b>Event Type</b></td>
    //                                         <td>${markerInfo.type}</td>
    //                                         </tr>
    //                                         <tr>
    //                                         <td><b>Position</b></td>
    //                                         <td>${markerInfo.latitude}, ${markerInfo.longitude}</td>
    //                                         </tr>>
    //                                     </tbody>
    //                                 </table>
    //                         </div>
    //                     </div>
    //                                 `
    //   });

    //   //add listener for the map infoWindow click
    //   marker.addListener('click', function() {
    //     infowindow.open(me.googleMap, marker);
    //   });

    //   //intialize tabs
    //   google.maps.event.addListener(infowindow, 'domready', function(e) {
    //     //intialize tabstrips.
    //     $('#tabstrip').kendoTabStrip({
    //       animation: {
    //         open: {
    //           effects: 'fadeIn'
    //         }
    //       }
    //     });
    //   });

    //   //extend bounds
      // me.latlngBounds.extend({
      //   lat: parseFloat(markerInfo.latitude),
      //   lng: parseFloat(markerInfo.longitude)
      // });
    // }

    //auto pan if option is selected
    if (me.mapControl.autoPan) {
      me.autoPan();
    }
  }

  /**
   * Render Geofence
   * @param {*} geofence a geofence object
   */
  renderGeofence(geofence) {
    let me = this;
    let geofenceMarker;

    //set the color
    let strokeColor = '#FF0000';
    let fillColor = '#FF0000';

    if (geofence.type === 'inclusive') {
      strokeColor = '#78F576';
      fillColor = '#78F576';
    }

    //render the shape
    switch (geofence.geoShape.type) {
    case 'circle':
      geofenceMarker = new google.maps.Circle({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        map: me.googleMap,
        center: geofence.geoShape.center,
        radius: geofence.geoShape.radius
      });
      break;
    case 'polygon':
      geofenceMarker = new google.maps.Polygon({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        map: me.googleMap,
        paths: geofence.geoShape.path.toJSON()
      });
      break;
    case 'rectangle':
      geofenceMarker = new google.maps.Polygon({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        map: me.googleMap,
        bounds: geofence.geoShape.bounds
      });
      break;
    default:
      break;
    }
    this.geofenceMarkers.push(geofenceMarker);
  }

  /**
   * Hide all locations
   */
  removeGeofences() {
    let geofences = this.geofenceMarkers;

    for (let i = 0; i < geofences.length; i++) {
      geofences[i].setMap(null);
    }
  }


  /**
   * Rendering locations aka POI
   */
  renderLocationsTree() {
    //GET all locations

    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          {
            field: 'name',
            title: 'Location',
            template: '<img src="/images/map/locations/#= type #.png" width="16" height="16"> #= name #'
          },
          {
            template: '<p> <input type="checkbox"  class="filled-in location-node" id="#:_id#" /><label for="#:_id#"></label></p>'
          },
          {
            field: 'type',
            title: 'Type',
            groupHeaderTemplate: '#= value # (#= count#)',
            hidden: true
          }
        ]
      },
      App.config.grid
    );

    //remove the necessary bit
    config.toolbar = null;
    config.sortable = false;
    config.scrollable = false;
    config.pageable = false;
    config.groupable = false;

    config.height = 'auto';

    //try and load all locations
    config.dataSource.pageSize = 1000;

    //grouping and aggregation
    config.dataSource.group = {
      field: 'type',
      dir: 'asc',
      aggregates: [{ field: 'type', aggregate: 'count' }]
    };

    //set the access url
    config.dataSource.transport.read.url = App.config.apiUrl + '/location';

    //render the grid
    this.grid = $('#location-tree').kendoGrid(config);
  }

  /**
   * Location selection handler (checkbox)
   */
  selectLocation() {
    let locationsToShow = [];
    let grid = $('#location-tree').data('kendoGrid');
    let ds = grid.dataSource.view();

    //select locations to display
    for (let i = 0; i < ds.length; i++) {
      for (let j = 0; j < ds[i].items.length; j++) {
        let row = grid.table.find("tr[data-uid='" + ds[i].items[j].uid + "']");
        let checkbox = $(row).find('.location-node');
        if (checkbox.is(':checked')) {
          locationsToShow.push(ds[i].items[j]);
        }
      }
    }

    if (locationsToShow.length) {
      this.showLocations(locationsToShow);
    } else {
      this.removeLocations();
    }
  }


  /**
   * Show selected locations
   */
  showLocations(locations) {
    let me = this;

    this.removeLocations();

    //loop and show all selected locations
    for (let i = 0; i < locations.length; i++) {
      let markerInfo = locations[i];
      //create marker object
      let marker = new google.maps.Marker({
        position: {
          lat: parseFloat(markerInfo.latitude),
          lng: parseFloat(markerInfo.longitude)
        },
        title: markerInfo.name,
        icon: `/images/map/locations/${markerInfo.type}.png`,
        map: me.googleMap,
        id: markerInfo._id
      });

      let infowindow = new google.maps.InfoWindow({
        content: `
                               <div id="tabstrip">
                            <ul>
                                <li class="k-state-active">
                                    Location Info
                                </li>
                            </ul>
                            <div>
                               <table>
                                        <tbody>
                                            <tr>
                                            <td><b>Name</b></td>
                                            <td>${markerInfo.name}${i}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Event Type</b></td>
                                            <td>${markerInfo.type}</td>
                                            </tr>
                                            <tr>
                                            <td><b>Position</b></td>
                                            <td>${markerInfo.latitude}, ${markerInfo.longitude}</td>
                                            </tr>>
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                                    `
      });

      //add listener for the map infoWindow click
      marker.addListener('click', function() {
        infowindow.open(me.googleMap, marker);
      });

      //intialize tabs
      google.maps.event.addListener(infowindow, 'domready', function(e) {
        //intialize tabstrips.
        $('#tabstrip').kendoTabStrip({
          animation: {
            open: {
              effects: 'fadeIn'
            }
          }
        });
      });

      //push the marker to class
      me.locationMarkers.push(marker);

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
  }

  /**
   * Hide all locations
   */
  removeLocations() {
    let locations = this.locationMarkers;

    for (let i = 0; i < locations.length; i++) {
      locations[i].setMap(null);
    }
  }

  /**
   * Render all locations on the map
   */
  showAllLocations() {
    // this.client.get('/location/?$limit=1000').then(res => {
    //   if (res) {
    //   }
    // });
  }

  /**
   * Display Location Creation Model
   */
  showLocationCreationModel() {
    let me = this;
    this.locationCreation = true;

    this.newLocation = {};

    //set the Google map dom listener
    this.dropMarkerListener = google.maps.event.addListener(
      this.googleMap,
      'click',
      function(event) {
        $('ul.tabs').tabs();
        //call function to create marker
        if (me.dropMarker) {
          me.dropMarker.setMap(null);
          me.dropMarker = null;
        }
        //set the DOM elements
        me.newLocation.latitude = event.latLng.lat().toPrecision(6);
        me.newLocation.longitude = event.latLng.lng().toPrecision(6);

        //create the pin
        me.dropMarker = me.createDropMarker(
          event.latLng,
          'name',
          `
           <button id="primaryTextButton" class="k-primary">Create a location</button>
        `
        );
      }
    );
  }

  /**
   * Hide Location Creation Model
   */
  hideLocationCreationModel() {
    this.locationCreation = false;
    //remove marker
    this.dropMarker.setMap(null);
    //remove the listener
    google.maps.event.removeListener(this.dropMarkerListener);
  }

  /**
   * Create a location
   */
  createLocation() {
    let me = this;
    console.log('createLocation');
    if (!this.newLocation.type) {
      this.newLocation.type = App.config.locationTypes[0];
    }
    if (
      this.newLocation.name &&
      this.newLocation.latitude &&
      this.newLocation.longitude
    ) {
      this.client
        .post('/location', {
          name: me.newLocation.name,
          type: me.newLocation.type,
          latitude: me.newLocation.latitude,
          longitude: me.newLocation.longitude
        })
        .then(res => {
          if (res) {
            this.renderLocationsTree();
            this.hideLocationCreationModel();
          }
        });
    } else {
      Materialize.toast('Please fill in all the necessary fields', 3000);
    }
  }


  /**
   * Display Geofence Creation Model
   */
  showGeofenceCreationModel() {
    this.geofenceCreation = true;
    this.newGeofence = {};

    //show controls
    this.showGeofenceCreationOverlay();
  }

  /**
   * Hide Geofence Creation Model
   */
  hideGeofenceCreationModel() {
    this.geofenceCreation = false;
    //remove marker
    this.deleteAllShape();
    //hide controls
    this.hideGeofenceCreationOverlay();
  }

  /**
   * Create a geofence
   */
  createGeofence() {
    let me = this;

    if (!this.newGeofence.type) {
      this.newGeofence.type = App.config.geofenceTypes[0];
    }
    if (this.newGeofence._location &&
      this.newGeofence.name &&
      this.newGeofence.geoShape
    ) {
      console.log(this.newGeofence);
      this.client
        .post('/geofence', me.newGeofence)
        .then(res => {
          if (res) {
            this.renderGeofencesTree();
            this.hideGeofenceCreationModel();
          }
        });
    } else {
      Materialize.toast('Please fill in all the necessary fields', 3000);
    }
  }


  /**
   * Rendering geofences
   */
  renderGeofencesTree() {
    //GET all geofences

    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          {
            field: 'name',
            title: 'Geofence',
            template: '<img src="/images/map/geofences/#= data.type #.png" width="16" height="16"> #= data.name #'
          },
          {
            template: '<p> <input type="checkbox"  class="filled-in geofence-node" id="#:data._id#" /><label for="#:data._id#"></label></p>'
          },
          {
            field: 'type',
            title: 'Type',
            groupHeaderTemplate: '#= value # (#= count#)',
            hidden: true
          }
        ]
      },
      App.config.grid
    );

    //remove the necessary bit
    config.toolbar = null;
    config.sortable = false;
    config.scrollable = false;
    config.pageable = false;
    config.groupable = false;

    config.height = 'auto';

    //try and load all locations
    config.dataSource.pageSize = 1000;

    //grouping and aggregation
    config.dataSource.group = {
      field: 'type',
      dir: 'asc',
      aggregates: [{ field: 'type', aggregate: 'count' }]
    };

    //set the access url
    config.dataSource.transport.read.url = App.config.apiUrl + '/geofence';

    //render the grid
    this.grid = $('#geofence-tree').kendoGrid(config);
  }


  /**
   * Geofence creation overlay
   */
  showGeofenceCreationOverlay() {
    let me = this;
    if (this.drawingManager) {
      //set the drawing control to map
      this.drawingManager.setMap(this.googleMap);
    } else {
      me.all_overlays = [];
      let selectedShape;
      this.drawingManager = new google.maps.drawing.DrawingManager({
      // drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE
          ]
        },
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 0.2,
          strokeWeight: 3,
          clickable: false,
          editable: true,
          zIndex: 1
        },
        polygonOptions: {
          clickable: true,
          draggable: true,
          editable: true,
          fillColor: '#ffff00',
          fillOpacity: 1

        },
        rectangleOptions: {
          clickable: true,
          draggable: true,
          editable: true,
          fillColor: '#ffff00',
          fillOpacity: 0.5
        }
      });

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        console.log('setSelection');
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
            // google.maps.event.addListener(selectedShape.getPath(), 'insert_at', getPolygonCoords(shape));
            // google.maps.event.addListener(selectedShape.getPath(), 'set_at', getPolygonCoords(shape));
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          selectedShape.setMap(null);
        }
      }


      function CenterControl(controlDiv, map) {
                // Set CSS for the control border.
        let controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Select to delete the shape';
        controlDiv.appendChild(controlUI);

                // Set CSS for the control interior.
        let controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Delete Selected Area';
        controlUI.appendChild(controlText);

                // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          deleteSelectedShape();
        });
      }
    //set the drawing control to map
      this.drawingManager.setMap(me.googleMap);

      let getPolygonCoords = function(newShape) {
        console.log('We are one');
        let len = newShape.getPath().getLength();
        for (let i = 0; i < len; i++) {
          console.log(newShape.getPath().getAt(i).toUrlValue(6));
        }
      };

      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function(event) {
        event.getPath().getLength();
        if (event.type === 'polygon') {
          me.newGeofence.geoShape = {};
          me.newGeofence.geoShape.type = event.type;
          me.pathToCoords(event.getPath(), (coords)=>{
            me.newGeofence.geoShape.path = coords;
          });
        }
        google.maps.event.addListener(event.getPath(), 'insert_at', function() {
          me.pathToCoords(event.getPath(), (coords)=>{
            me.newGeofence.geoShape.path = coords;
          });
        });
        google.maps.event.addListener(event.getPath(), 'set_at', function() {
          me.pathToCoords(event.getPath(), (coords)=>{
            me.newGeofence.geoShape.path = coords;
          });
        // for (let i = 0; i < len; i++) {
        //   console.log(event.getPath().getAt(i).toUrlValue(5));
        // }
        });
      });

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(event) {
        me.all_overlays.push(event);
        //circle
        if (event.type === 'circle') {
          me.newGeofence.geoShape = {};
          me.newGeofence.geoShape.type = event.type;
          me.newGeofence.geoShape.center = event.overlay.getCenter();
          me.newGeofence.geoShape.radius = event.overlay.getRadius();
          //rectange
        } else if (event.type === 'rectangle') {
          me.newGeofence.geoShape = {};
          me.newGeofence.geoShape.type = event.type;
          me.newGeofence.geoShape.bounds = event.overlay.getBounds();
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          me.drawingManager.setDrawingMode(null);
                    //Write code to select the newly selected object.

          let newShape = event.overlay;
          newShape.type = event.type;
          google.maps.event.addListener(newShape, 'click', function() {
            setSelection(newShape);
          });

          setSelection(newShape);
        }
      });


      let centerControlDiv = document.createElement('div');
      let centerControl = new CenterControl(centerControlDiv, me.googleMap);

      centerControlDiv.index = 1;
      me.googleMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }
  }

  deleteAllShape() {
    for (let i = 0; i < this.all_overlays.length; i++) {
      this.all_overlays[i].overlay.setMap(null);
    }
    this.all_overlays = [];
  }

  hideGeofenceCreationOverlay() {
    //set the drawing control to map
    this.drawingManager.setMap(null);
  }

  /**
   * Convert path object to lat and lng coordinates
   * @param {*} path
   */
  pathToCoords(path, callback) {
    let len = path.length;
    let coords = [];
    for (let i = 0; i < len; i++) {
      coords.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng()
      });
    }

    callback && callback(coords);
  }

  /**
   * Once dom is deattached
   */
  deattached() {
    console.info('map deattached');
    this.stopRefresher();
  }
}
