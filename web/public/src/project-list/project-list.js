import { inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Http)
export class ProjectList {
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
      onTagAdd: function(event, tag) {
        if (me.tagger) {
          me.renderGrid(me.tagger.getTags().values);
        }
      },
      //on removal of tag
      onTagRemove: function(event, tag) {
        me.renderGrid(me.tagger.getTags().values);
      }
    });
    //render all assets grid
    this.renderGrid();
  }

  renderGrid(tags) {
    console.log('render grid');
    //set columns for the grid
    let config = $.extend(
      true,
      {
        detailTemplate: kendo.template($('#template').html()),
        columns: [
          {
            template: "<a href='\\#asset-list/#:_id#'>#:name#</a>",
            field: 'name',
            title: 'Project Name',
            width: 150,
            filterable: {
              cell: {
                showOperators: false,
                operator: 'contains',
                suggestionOperator: 'contains'
              }
            }
          },
          {
            field: 'assets',
            title: 'Assets',
            filterable: false,
            template: function(dataItem) {
              let html = [];
              for (let i = 0; i < dataItem.assets.length; i++) {
                if (dataItem.assets[i]) {
                  html.push(
                    `<a href='#asset-details/${dataItem.assets[i]._id}'>${dataItem.assets[i].name}</a>`
                  );
                }
              }
              return html.join(', ');
            }
          }
        ]
      },
      App.config.grid
    );

    //check for project admin access(2)
    if (App.currentUser.privileges.indexOf(2) > -1) {
      config.toolbar.push({
        template: '<a class="k-button" href="\\#/project-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
      });
    }

    //set the data types
    config.dataSource.schema.model.fields = {
      name: { type: 'string' }
    };

    //extend to include tags
    if (tags) {
      config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
    }
    //set the request url
    config.dataSource.transport.read.url = App.config.apiUrl + '/project';

    this.grid = $('#projectGrid').kendoGrid(config);
  }
}
