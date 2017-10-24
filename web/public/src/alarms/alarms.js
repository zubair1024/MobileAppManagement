import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class Alarms {
  constructor(http) {
    this.http = http;
  }

  attached() {
    App.currentView = this;
    //render all active alarms grid
    this.renderAlarms();
  }

  /**
  * Render Active Alarms List
  */
  renderAlarms() {
    let me = this;

    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          {
            field: '_asset.name',
            title: 'Asset',
            template: "# if (_asset) { # <a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a> #}#"
          },
          { field: 'name', title: 'Alarm' },
          {
            field: 'triggerTime',
            title: 'Trigger Time',
            template: '#: App.util.format.dateTime(data.triggerTime, App.currentUser.dateTimeFormat) #'
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
    if (App.currentUser.privileges.indexOf(5) > -1) {
      config.columns.push(
        {
          command: { text: 'Reset', click: me.acknowledgeAlarm },
          title: 'Command',
          width: '100px'
        }
      );
    }

    //set the request url
    config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';

    //filter only the triggered alarms
    config.dataSource.filter = { field: 'triggered', operator: 'eq', value: true };

    this.grid = $('#alarms').kendoGrid(config);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
            App.currentView.renderAlarms();
          },
          error: function(err) {
            me.renderAlarms();
          }
        });
      },
      function() {
        kendo.alert('Acknowledgement cancelled');
      }
    );
  }
}
