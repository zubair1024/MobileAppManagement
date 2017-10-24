import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class Administration {
  constructor(http) {
    this.http = http;
  }

  attached() {
    App.currentView = this;

    //tab strip
    $('.tabstrip').kendoTabStrip({
      animation: {
        open: {
          effects: 'fadeIn'
        }
      }
    });

    //render all active alarms grid
    this.renderUsers();
  }

  /**
   * Render grid listing all assets
   * @param {*} tags
   */
  renderUsers(tags) {
    //set columns for the grid
    let config = $.extend(
      true,
      {
        detailTemplate: kendo.template($('#template').html()),
        columns: [
          {
            field: 'loginName',
            title: 'Login Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'name',
            title: 'Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'firstName',
            title: 'First Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'lastName',
            title: 'Last Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'phoneNo',
            title: 'Phone Number',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'updated_at',
            title: 'Modified Time',
            template: "# if (updated_at){# #: moment(updated_at).format('DD/M/YYYY h:mm:ss a') # #}#",
            filterable: {
              extra: 'true',
              messages: {
                info: 'Show items between dates:'
              }
            }
          }
        ]
      },
      App.config.grid
    );

    config.toolbar.push({
      template: '<a class="k-button" href="\\#/user-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
    });

    //set the data types
    // config.dataSource.schema.model.fields = {
    //   name: { type: 'string' },

    // };

    //extend to include tags
    if (tags) {
      config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
    }

    //set the request url
    config.dataSource.transport.read.url = App.config.apiUrl + '/user';

    this.grid = $('#appUsers').kendoGrid(config);
  }

}
