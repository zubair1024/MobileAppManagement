import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { HttpClient } from 'aurelia-fetch-client';

@inject(Http, HttpClient)
export class Geofences {
  constructor(http, httpClient) {
    this.http = http;
    this.fetchAPI = httpClient;
  }

  attached() {
    App.currentView = this;

    //render all active alarms grid
    this.renderGeofences();
  }

  /**
     * Render Active Alarms List
     */
  renderGeofences() {
    let me = this;

    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          {
            field: 'name',
            title: 'Geofence'
          },
          {
            field: 'type',
            title: 'Geofence Type'
          }
        ]
      },
      App.config.grid
    );

    //don't auto adjust
    config.dataBound = function() {
      //do nothing
    };

    // check if geofence admins is active for the user
    if (App.currentUser.privileges.indexOf(4) > -1) {
      config.columns.push(
        {
          command: { text: 'Delete', click: me.deleteGeofence },
          title: 'Command',
          width: '100px'
        }
      );
    }

    //set the request url
    config.dataSource.transport.read.url = App.config.apiUrl + '/geofence';

    this.grid = $('#geofences').kendoGrid(config);
  }

  /**
     * Acknowledge alarm
     * @param {*} e an click event on the grid
     */
  deleteGeofence(e) {
    e.preventDefault();

    let dataItem = this.dataItem($(e.currentTarget).closest('tr'));

    kendo.confirm('Are you sure you want to delete?').then(
      function(data) {
        $.ajax({
          method: 'DELETE',
          url: App.config.apiUrl + '/geofence/',
          data: { _id: dataItem._id },
          success: function(res) {
            kendo.alert('Deletion sucessful');
            //re-render the active alarms grid
            App.currentView.renderGeofences();
          },
          error: function(err) {
            me.renderGeofences();
          }
        });
      },
      function() {
        kendo.alert('Deletion cancelled');
      }
    );
  }

  /**
 * Mass upload locations
 */
  massUpload(files) {
    console.log('upload file');
    if (files && files[0]) {
      let file = files[0];
      let filename;

      //set the file name
      if (file.name.match('.csv')) {
        filename = App.currentUser._id + '_' + Date.now() + '.csv';
      } else if (file.name.match('.json')) {
        filename = App.currentUser._id + '_' + Date.now() + '.json';
      } else {
        Materialize.toast('Please upload a .csv or .json file', 3000);
      }
      if (filename) {
        //form-data
        let formData = new FormData();
        formData.append('files', file, filename);
        //use FETCH API to POST file

        this.fetchAPI
          .fetch(App.config.apiUrl + '/geofence/upload', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data) {
              Materialize.toast('File uploaded successfully', 3000);
            }
          })
          .catch(error => Materialize.toast(error.message, 5000));
      }
    } else {
      Materialize.toast('Please upload a file.', 2000);
    }
  }
}
