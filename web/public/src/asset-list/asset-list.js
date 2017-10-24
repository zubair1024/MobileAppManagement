import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { Chart } from 'chart.js';

import { Router } from 'aurelia-router';

@inject(Http, Router)
export class AssetList {
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

    //render engine rating pie
    me.renderEngineRatingChart();

    //render genset capacity graph
    me.renderCapacityChart();
  }

  /**
     * Get the asset model
     * @param {*} id Asset _id
     */
  getProject(id, callback) {
    this.http.client.get(`/project/id/${id}`).then(res => {
      if (res && res.data) {
        this.project = res.data[0];
        callback();
      }
    });
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
            template: "<a href='\\#asset-details/#:_id#'>#:name#</a>",
            field: 'name',
            title: 'Asset Name',
            width: 150,
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'model',
            title: 'Model Name',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'manufacturer',
            title: 'Manufacturer',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'controlPanelManufacturer',
            title: 'Control Panel Manufacturer',
            filterable: {
              cell: {
                operator: 'contains'
              }
            }
          },
          {
            field: 'updated_at',
            title: 'Modified Time',
            template: '#: App.util.format.dateTime(data.updated_at, App.currentUser.dateTimeFormat) #',
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
        template: '<a class="k-button" href="\\#/asset-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
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
    config.dataSource.transport.read.url = App.config.apiUrl + '/asset';
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
  /**
   * Render Engine Rating Pie Chart
   */
  renderEngineRatingChart() {
    let me = this;
    let url = this.project._id
      ? `/statistics/generatorenginerating/${this.project._id}`
      : '/statistics/generatorenginerating/';
    //add mask
    this.loadingEngineRatingChart = true;
    this.http.client.get(url).then(res => {
      me.noEngineRatingChart = false;
      //remove mask
      me.loadingEngineRatingChart = false;
      if (res && res.data.length && res.data[0].generatorEngineRating) {
        let engineRating = res.data[0].generatorEngineRating;
        me.cards.engineRatingChart = new Chart(me.engineRatingChart, {
          type: 'pie',
          data: {
            labels: ['Prime', 'Continous', 'Stand-by'],
            datasets: [
              {
                data: [
                  engineRating.prime,
                  engineRating.continuous,
                  engineRating.standby
                ],
                backgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa'],
                hoverBackgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa']
              }
            ]
          }
        });
      } else {
        //hide element
        me.noEngineRatingChart = true;
      }
    });
  }
  /**
   * Render Capcity Bar Chart
   */
  renderCapacityChart() {
    let me = this;
    let url = this.project._id
      ? `/statistics/generatorcapacity/${this.project._id}`
      : '/statistics/generatorcapacity/';
    //add mask
    this.loadingCapacityChart = true;
    this.http.client.get(url).then(res => {
      //remove mask
      me.loadingCapacityChart = false;
      if (res && res.data.length && res.data[0].generatorCapacity) {
        me.noCapacityChart = false;
        let data = [];
        let categories = [];
        let generatorCapacity = res.data[0].generatorCapacity;
        for (let rating in generatorCapacity) {
          data.push(generatorCapacity[rating]);
          categories.push(rating);
        }
        //render chart
        $(this.capacityChart).kendoChart({
          title: {
            text: 'Genset Capacity Statistics'
          },
          theme: 'material',
          legend: {
            position: 'top'
          },
          seriesDefaults: {
            type: 'column'
          },
          seriesColors: ['#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'],
          series: [
            {
              name: 'Generators',
              data: data
            }
          ],
          valueAxis: {
            labels: {
              format: '{0}'
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

            // labels: {

            //     padding: { top: 135 }

            // }
          },
          tooltip: {
            visible: true,
            format: '{0} kVA',
            template: '#= series.name #: #= value #'
          }
        });
      } else {
        //hide element
        me.noCapacityChart = true;
      }
    });
  }
}
