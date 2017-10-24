import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { HttpClient } from 'aurelia-fetch-client';

import { Router } from 'aurelia-router';

@inject(Http, HttpClient, Router)
export class UserAdmin {
  loading = true;

  //asset model
  model = {
    assets: [],
    privileges: []
  };

  //creating (false) or updating flag (true)
  update = false;

  //asset tags
  tagger;

  //list of non-aurelia based controls
  controls = {};

  constructor(http, httpClient, router) {
    this.client = http.client;
    this.fetchAPI = httpClient;
    this.router = router;

    //get user role settings
    this.possiblePrivileges = App.config.privileges;
  }

  /**
     * Once the component is activated
     * @param {string} params asset _id
     */
  activate(params) {
    console.log('user admin activate');
  }

  /**
     * Once the DOM is attached
     */
  attached() {
    console.log('user admin attached');
    let me = this;
    console.log(this.router.currentInstruction.params);
    if (
      this.router.currentInstruction.params &&
      this.router.currentInstruction.params.id
    ) {
      let id = this.router.currentInstruction.params.id;
      //updating
      this.update = true;
      this.client.get(`/user/id/${id}`).then(res => {
        this.loading = false;
        if (res && res.data) {
          this.model = res.data[0];
          this.displayControls();
        }
      });
    } else {
      this.displayControls();
      this.loading = false;
    }
  }

  displayControls() {
    let me = this;
    //create the timezone selector with the value
    this.controls.timezone = $('#timezone').kendoComboBox({
      dataTextField: 'text',
      dataValueField: 'offset',
      dataSource: App.config.timezone,
      filter: 'contains',
      suggest: true,
      value: me.model.timezone ? me.model.timezone : 4
    });

    //create the distance selector with the value
    this.controls.distance = $('#distance').kendoComboBox({
      dataSource: App.config.distance,
      filter: 'contains',
      suggest: true,
      value: me.model.distance ? me.model.distance : 'km'
    });

    //create the distance selector with the value
    this.controls.speed = $('#speed').kendoComboBox({
      dataSource: App.config.speed,
      filter: 'contains',
      suggest: true,
      value: me.model.speed ? me.model.speed : 'km/hr'
    });

    //create the pressure selector with the value
    this.controls.pressure = $('#pressure').kendoComboBox({
      dataSource: App.config.pressure,
      filter: 'contains',
      suggest: true,
      value: me.model.v ? me.model.pressure : 'psi'
    });

    //create the distance selector with the value
    this.controls.volume = $('#volume').kendoComboBox({
      dataSource: App.config.volume,
      filter: 'contains',
      suggest: true,
      value: me.model.volume ? me.model.volume : 'l'
    });
  }
  /**
     * Create or Update Asset
     */
  submit() {
    this.loading = true;

    //get all third  party control values
    for (let key in this.controls) {
      this.model[key] = this.controls[key].val();
    }

    if (this.update) {
      //update

      this.client.put(`/user/id/${this.model._id}`, this.model).then(data => {
        this.loading = false;

        if (data && data.message) {
          Materialize.toast(data.message, 5000);
          //go to the list
          window.location.hash = '#/administration';
        }
      });
    } else {
      //create

      this.client.post('/user/', this.model).then(data => {
        this.loading = false;

        if (data && data.message) {
          Materialize.toast(data.message, 5000);
          //go to the list
          window.location.hash = '#/administration';
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
    this.client.delete(`/user/id/${this.model._id}`).then(data => {
      this.loading = false;
      if (data && data.message) {
        Materialize.toast(data.message, 5000);
        //go to the list
        window.location.hash = '#/administration';
      }
    });

    // }
  }
}
