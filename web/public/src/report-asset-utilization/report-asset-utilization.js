import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class ReportAssetUtilization {
  http;

  //widgets
  grid;
  tagger;

  constructor(http) {
    this.http = http;
  }

  attached() {
    let me = this;
    //init tagger input
    this.tagger = new Taggle('list-tags', {
      allowDuplicates: false,
      //on addition of tags
      onTagAdd: function (event, tag) {
        if (me.tagger) {
          me.renderGrid(me.tagger.getTags().values);
        }
      },
      //on removal of tag
      onTagRemove: function (event, tag) {
        me.renderGrid(me.tagger.getTags().values);
      }
    });
    //render all assets grid
    this.renderGrid();
  }

  /**
   *
   * @param {*} tags
   */
  renderGrid(tags) {
    console.log('render grid');
    //set columns for the grid
    let config = $.extend(
      true,
      {
        columns: [
          {
            template: "# if(_asset.pState == 1){ # <a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a> # }else{ # #:_asset.name#  # } #",
            field: 'name',
            title: 'Asset Name',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            template: "#: moment(startTime).format('D/M/YYYY') #",
            field: 'startTime',
            title: 'Date'
          },
          {
            field: 'powerOutputKW',
            title: 'Power Output in KW',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'averagePowerOutput',
            title: 'Average Power Output in KW',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'totalFuelUsed',
            title: 'Total Fuel Used',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'totalEngineHours',
            title: 'Total Engine Hours',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          }
        ]
      },
      App.config.grid
    );

    config.dataBound = function () {
      //do nothing
    };

    //set the data types
    config.dataSource.schema.model.fields = {
      name: { type: 'string' }
    };

    //extend to include tags
    if (tags) {
      config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
    }
    //set the request url
    config.dataSource.transport.read.url =
      App.config.apiUrl + '/statistics/assetutilization';

    this.grid = $('#assetUtilizationGrid').kendoGrid(config);
  }
}
