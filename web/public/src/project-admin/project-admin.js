import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { HttpClient } from 'aurelia-fetch-client';

@inject(Http, HttpClient)
export class ProjectAdmin {
  loading = true;

  //asset model
  model = {
    assets: []
  };

  //creating (false) or updating flag (true)
  update = false;

  //asset tags
  tagger;

  constructor(http, httpClient) {
    this.client = http.client;
    this.fetchAPI = httpClient;
  }

  /**
     * Once the component is activated
     * @param {string} params asset _id
     */
  activate(params) {
    console.log('project admin activate');
    if (params.id) {
      //updating
      this.update = true;
      this.client.get(`/project/id/${params.id}`).then(res => {
        this.loading = false;
        if (res && res.data) {
          this.model = res.data[0];
          this.tagger.add(this.model.tags);
          //set the value
          if (this.model.assets.length) {
            $(this.projectAssets)
              .data('kendoMultiSelect')
              .value(this.model.assets);
            //redo the assets list
            for (let i = 0; i < this.model.assets.length; i++) {
              // this.model.assets[i] = this.model.assets[i]._id;
              this.model.assets[i] = this.model.assets[i];
            }
          }
        }
      });
    } else {
      this.loading = false;
    }
  }

  /**
     * Once the DOM is attached
     */
  attached() {
    console.log('project admin attached');
    let me = this;
    //init tagger input
    this.tagger = new Taggle('project-tags', {
      allowDuplicates: false
    });

    //asset list multiselect
    $(this.projectAssets).kendoMultiSelect({
      placeholder: 'Select gensets...',
      dataTextField: 'name',
      dataValueField: '_id',
      ignoreCase: false,
      filter: 'contains',
      minLength: 3,
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
            url: App.config.apiUrl + '/misc/find/'
          }
        }
      },
      select: function(e) {
        //navigate to object
        if (e.dataItem._id) {
          me.model.assets.push(e.dataItem._id);
        }
      },
      deselect: function(e) {
        //navigate to object
        if (e.dataItem._id) {
          let idx = me.model.assets.indexOf(e.dataItem._id);
          if (idx > -1) {
            me.model.assets.splice(idx, 1);
          }
        }
      }

      //  value: []
    });
  }
  /**
     * Create or Update Asset
     */
  submit() {
    this.loading = true;

    //get tags
    if (this.tagger) {
      this.model.tags = this.tagger.getTags().values;
    }

    if (this.update) {
      //update
      this.client
        .put(`/project/id/${this.model._id}`, this.model)
        .then(data => {
          this.loading = false;
          if (data && data.message) {
            Materialize.toast(data.message, 5000);
            //go to the list
            window.location.hash = '#/project-list';
          }
        });
    } else {
      //create
      this.client.post('/project/', this.model).then(data => {
        this.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);
          //go to the list
          window.location.hash = '#/project-list';
        }
      });
    }
  }

  /**
   * Delete the asset
   */
  delete() {
    // if (this.model.assets.length) {
    // Materialize.toast('Please deallocate assets if you want to delete the project.', 3000);
    // } else {
    //delete project
    this.client.delete(`/project/id/${this.model._id}`).then(data => {
      this.loading = false;
      if (data && data.message) {
        Materialize.toast(data.message, 5000);
        //go to the list
        window.location.hash = '#/project-list';
      }
    });

    // }
  }
}
