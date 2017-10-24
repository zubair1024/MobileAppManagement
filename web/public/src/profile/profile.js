import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Http } from '../http';

@inject(Aurelia, Http, HttpClient)
export class Profile {
  loading = true;
  //user model
  model;

  //list of non-aurelia based controls
  controls = {};

  constructor(aurelia, http, httpclient) {
    this.client = http.client;
    this.httpclient = httpclient;
    this.aurelia = aurelia;
  }

  /**
   * Load user profile data
   */
  activate() {
    //get the user from local storage
    this.model = JSON.parse(localStorage.getItem('currentUser'));
    this.loading = false;
  }

  /**
   * DOM attachment
   */
  attached() {
    let me = this;

    console.log(me.model);

    //create the timezone selector with the value
    this.controls.timezone = $('#timezone').kendoComboBox({
      dataSource: moment.tz.names(),
      filter: 'contains',
      suggest: true,
      value: me.model.timezone ? me.model.timezone : 'Asia/Dubai'
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

    //create the temperature selector with the value
    this.controls.temperature = $('#temperature').kendoComboBox({
      dataSource: App.config.temperature,
      filter: 'contains',
      suggest: true,
      value: me.model.temperature ? me.model.temperature : 'Celsius'
    });

    //create the dateTime selector with the value
    this.controls.dateTimeFormat = $('#dateTime').kendoComboBox({
      dataSource: App.config.dateTimeFormat,
      filter: 'contains',
      suggest: true,
      value: me.model.dateTimeFormat
        ? me.model.dateTimeFormat
        : 'D/MM/YYYY h:mm:ss a'
    });

    //create the date selector with the value
    this.controls.dateFormat = $('#date').kendoComboBox({
      dataSource: App.config.dateFormat,
      filter: 'contains',
      suggest: true,
      value: me.model.dateFormat ? me.model.dateFormat : 'D/MM/YYYY'
    });

    //create the time selector with the value
    this.controls.timeFormat = $('#time').kendoComboBox({
      dataSource: App.config.timeFormat,
      filter: 'contains',
      suggest: true,
      value: me.model.timeFormat ? me.model.timeFormat : 'h:mm:ss a'
    });
  }

  /**
   * Submit profile changes
   */
  submit() {
    let me = this;
    this.loading = true;

    //get all third  party control values
    for (let key in this.controls) {
      this.model[key] = this.controls[key].val();
    }

    this.client.put(`/user/${this.model.loginName}`, this.model).then(data => {
      me.loading = false;
      if (data && data.message) {
        Materialize.toast(data.message, 5000);
        //logout user
        localStorage.removeItem('currentUser');
        this.aurelia.setRoot('login/login');
      }
    });
  }

  /**
   * Uploading an avatar
   * @param {*} images
   */
  uploadAvatar(images) {
    if (images && images[0]) {
      let image = images[0];
      let filename;

      console.log(images[0]);

      switch (image.type) {
      case 'image/png':
        filename = this.model.loginName + '.png';
        break;

      case 'image/jpeg':
        filename = this.model.loginName + '.jpg';
        break;

      default:
        Materialize.toast('Please upload a .jpg or .png file', 3000);
        break;
      }

      //if filename exists
      if (filename) {
        let me = this;
        //form-data
        let formData = new FormData();
        formData.append('images', image, filename);
        formData.append('user', this.model.loginName);

        //use FETCH API to POST image

        this.httpclient
          .fetch(App.config.apiUrl + '/user/photo', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            localStorage.removeItem('currentUser');
            me.aurelia.setRoot('login/login');
          })
          .catch(error => Materialize.toast(error.message, 5000));
      }
    } else {
      Materialize.toast('Please upload an image.', 2000);
    }
  }
}
