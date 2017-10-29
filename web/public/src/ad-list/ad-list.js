import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { Chart } from 'chart.js';

import { Router } from 'aurelia-router';

@inject(Http, Router)
export class AdList {
  http;
  user;

  //project object
  project = {};

  //widgets
  grid;
  tagger;
  cards = {};

  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.user = App.currentUser;
  }

  /**
   * Run once DOM is attached
   */
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

    //check if it's a project view
    if (
      this.router.currentInstruction.params &&
      this.router.currentInstruction.params.id
    ) {
      let id = this.router.currentInstruction.params.id;
      this.getProject(id, () => {
        this.loading = false;
        this.deferred();
      });
    } else {
      this.deferred();
    }
  }

  deferred() {
    let me = this;
    //render all assets grid
    me.renderGrid();
  }

  /**
   * Render grid listing all assets
   * @param {*} tags
   */
  renderGrid(tags) {
    //set columns for the grid
    let config = $.extend(
      true,
      {
        detailTemplate: kendo.template($('#template').html()),
        columns: [
          {
            template: "<a href='\\#ad-admin/#:_id#'>#:name#</a>",
            field: 'name',
            title: 'Ad Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'updatedTime',
            title: 'Modified Time',
            template: '#: App.util.format.dateTime(data.updatedTime, App.currentUser.dateTimeFormat) #',
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

    //check for asset admin access(1)
    if (App.currentUser.privileges.indexOf(1) > -1) {
      config.toolbar.push({
        template: '<a class="k-button" href="\\#/ad-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
      });
    }

    //set the data types
    // config.dataSource.schema.model.fields = {
    //   name: { type: 'string' },

    // };

    //extend to include tags
    if (tags) {
      config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
    }

    //set the request url
    config.dataSource.transport.read.url = App.config.apiUrl + '/ad';
    //get project filter
    if (this.project._id && this.project.assets) {
      config.dataSource.filter = $.extend(config.dataSource.filter, {
        field: 'ids',
        operator: 'eq',
        value: this.project.assets.join(',')
      });
    }

    this.grid = $('#assetGrid').kendoGrid(config);
  }
}
