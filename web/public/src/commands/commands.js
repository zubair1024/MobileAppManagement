import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class Commands {
  imeis = [];
  interfaceMap = [];

  //btn flags
  btnText = 'Send Command';
  btnDisable = false;

  rawCommand;
  constructor(http) {
    this.http = http;
  }

  attached() {
    let me = this;
    App.currentView = this;

    //initialize multiselect for assets
    $('#command-multiselect').kendoMultiSelect({
      autoBind: true,
      dataTextField: 'name',
      dataValueField: 'name',
      filter: 'contains',
      suggest: true,
      index: 3,
      select: function(data) {
        me.imeis.push(data.dataItem.sensor);
        me.interfaceMap.push(data.dataItem.interfaceType);
      },
      deselect: function(data) {
        console.log('deselect');
        let index = me.imeis.indexOf(data.dataItem.sensor);
        if (index > -1) {
          me.imeis.splice(index, 1);
          me.interfaceMap.splice(index, 1);
        }
      },
      dataSource: {
        type: 'odata',
        serverFiltering: false,
        transport: {
          read: {
            url: App.config.apiUrl + '/asset',
            type: 'GET',
            contentType: 'application/json',
            accept: 'application/json, text/plain, */*',
            dataType: 'json',
            xhrFields: { withCredentials: true }
          }
        },
        schema: {
          data: 'data.docs',
          total: 'data.total',
          model: {
            fields: {
              eventTime: { type: 'date' },
              createdTime: { type: 'date' },
              updated_at: { type: 'date' },
              created_at: { type: 'date' }
            }
          }
        }
      }
    });
  }

  //send commands to selected list of assets
  sendCommand() {
    this.btnText = 'Sending';
    this.btnDisable = true;

    this.http.client.post('/asset/rawcommand', {
      imeis: this.imeis,
      interfaceMap: this.interfaceMap,
      command: this.rawCommand
    }).then((res) => {
      this.btnText = 'Send Command';
      this.btnDisable = false;
      if (res && res.message) {
        Materialize.toast(res.message, 3000);
      }
    });
  }
}
