import { inject } from 'aurelia-framework';
import { Http } from '../http';
import { HttpClient } from 'aurelia-fetch-client';

@inject(Http, HttpClient)
export class AdAdmin {
  loading = true;

  //asset model
  model = {
  };

  //creating (false) or updating flag (true)
  update = false;

  image;

  validation = {};

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
    if (params.id) {
      //updating
      this.update = true;
      this.client.get(`/asset/id/${params.id}`).then(res => {
        this.loading = false;
        if (res && res.data) {
          //set the asset model
          this.model = $.extend(true, this.model, res.data[0]);
          //add tags
          this.tagger.add(this.model.tags);
          //set Generator Frequency Value
          if (this.model.generatorFrequency) {
            $(this.generatorFrequency)
              .data('kendoDropDownList')
              .value(this.model.generatorFrequency);
          }
          if (this.model.generatorEngineRating) {
            $(this.generatorEngineRating)
              .data('kendoDropDownList')
              .value(this.model.generatorEngineRating);
          }
          if (this.model.status) {
            $(this.status).data('kendoDropDownList').value(this.model.status);
          }
          if (this.model.interfaceType) {
            $(this.interfaceType)
              .data('kendoDropDownList')
              .value(this.model.interfaceType);
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
    let me = this;
    //init tagger input
    this.tagger = new Taggle('admin-tags', {
      allowDuplicates: false
    });

    //create generator Frequency dropdown
    $(this.generatorFrequency).kendoDropDownList({
      dataSource: App.config.generatorFrequency,
      // index: 0,
      change: function () {
        //set the changed value
        me.model.generatorFrequency = this.value();
      }
    });
    //generator engine rating dropdown
    $(this.generatorEngineRating).kendoDropDownList({
      dataSource: App.config.generatorEngineRating,
      // index: 0,
      change: function () {
        //set the changed value
        me.model.generatorEngineRating = this.value();
      }
    });
    //generator status dropdown
    $(this.status).kendoDropDownList({
      dataSource: App.config.generatorStatus,
      // index: 0,
      change: function () {
        //set the changed value
        me.model.status = this.value();
      }
    });
    //mailbox types
    $(this.interfaceType).kendoDropDownList({
      dataSource: App.config.interfaceType,
      // index: 0,
      change: function () {
        //set the changed value
        me.model.interfaceType = this.value();
      }
    });
  }

  /**
   * Uploading an avatar
   * @param {*} images
   */
  uploadAssetImage(images) {
    console.log('uploadAssetImage');
    if (images && images[0]) {
      let image = images[0];
      let filename;

      switch (image.type) {
        case 'image/png':
          filename = this.model._id + '.png';
          break;

        case 'image/jpeg':
          filename = this.model._id + '.jpg';
          break;

        default:
          Materialize.toast('Please upload a .jpg or .png file', 3000);
          break;
      }
      if (filename && this.model._id) {
        let me = this;
        //form-data
        let formData = new FormData();
        formData.append('images', image, filename);
        formData.append('_id', this.model._id);

        //use FETCH API to POST image

        this.fetchAPI
          .fetch(App.config.apiUrl + '/asset/photo', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data) {
              Materialize.toast('Asset image uploaded successfully.', 3000);
            }
          })
          .catch(error => Materialize.toast(error.message, 5000));
      }
    } else {
      Materialize.toast('Please upload an image.', 2000);
    }
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
      this.client.put(`/ad/id/${this.model._id}`, this.model).then(data => {
        this.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);
          //go to the list
          window.location.hash = '#/ad-list';
        }
      });
    } else {
      //create
      this.client.post('/ad/', this.model).then(data => {
        this.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);
          //go to the list
          window.location.hash = '#/ad-list';
        }
      });
    }
  }


  /**
   * Delete the asset
   */
  delete() {
    //create
    this.client.delete(`/ad/id/${this.model._id}`).then(data => {
      this.loading = false;
      if (data && data.message) {
        Materialize.toast(data.message, 5000);
        //go to the list
        window.location.hash = '#/ad-list';
      }
    });
  }

  validateInformation(images) {
    let me = this;
    this.loading = true;
    console.log('validateInformation');
    let valid = true;

    this.validation.name = false;
    this.validation.linkedUrl = false;

    //name
    if (!this.model.name || this.model.name === '') {
      valid = false;
      this.validation.name = true;
    }


    //linkedUrl
    if (!this.model.linkedUrl || this.model.linkedUrl === '') {
      valid = false;
      this.validation.linkedUrl = true;
    }


    if (valid) {
      //neeed to do something aboutt the images before doing this
      let formData = new FormData();
      if (me.images) {
        formData.append('images', me.images[0], `deed_${me.model.name}.jpg`);
      }
      formData.append('model', JSON.stringify(me.model));




      //get tags
      if (this.tagger) {
        this.model.tags = this.tagger.getTags().values;
      }

      if (!this.update) {

        $.ajax({
          url: 'http://localhost/ad',
          method: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          success: function (data) {
            if (data) {
              Materialize.toast(data, 5000);
              //go to the list
              window.location.hash = '#/ad-list';
            }
          },
          error: function (err) {
            console.log(err);
          }
        });
      }
    } else {
      Materialize.toast('Please fill up all the necessary information', 3000);
    }
  }
}


export class FileListToArrayValueConverter {
  toView(fileList) {
    let files = [];
    if (!fileList) {
      return files;
    }
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList.item(i));
    }
    return files;
  }
}

export class BlobToUrlValueConverter {
  toView(blob) {
    return URL.createObjectURL(blob);
  }
}

