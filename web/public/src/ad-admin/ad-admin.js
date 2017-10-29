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
      this.client.get(`/ad/id/${params.id}`).then(res => {
        this.loading = false;
        if (res && res.data) {
          //set the asset model
          this.model = $.extend(true, this.model, res.data[0]);
          //add tags
          this.tagger.add(this.model.tags);
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
      //get tags
      if (me.tagger) {
        me.model.tags = me.tagger.getTags().values;
      }
      //neeed to do something aboutt the images before doing this
      let formData = new FormData();
      if (me.images) {
        formData.append('images', me.images[0], `deed_${me.model.name}.jpg`);
      }
      formData.append('model', JSON.stringify(me.model));

      if (!this.update) {
        $.ajax({
          url: 'http://localhost/ad',
          method: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          success: function(data) {
            if (data) {
              Materialize.toast(data, 5000);
              //go to the list
              window.location.hash = '#/ad-list';
            }
          },
          error: function(err) {
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

