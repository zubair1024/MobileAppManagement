import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router';

@inject(Aurelia, HttpClient, Router)
export class Http {
  constructor(aurelia, client, router) {
    let me = this;
    this.client = client;
    this.aurelia = aurelia;
    this.router = router;
    console.log('client contructor');

    this.client.configure(x => {
      x.withBaseUrl(App.config.apiUrl);
      x
        .withHeader('Access-Control-Allow-Credentials', 'application/json')
        .withHeader('content-type', 'application/json')
        .withHeader('Accept', 'application/json, text/plain, */*')
        .withCredentials(true)
        .withInterceptor({
          request(message) {
            // console.log('request');
            return message;
          },

          requestError(error) {
            // console.log('requestError');
            throw error;
          },

          response(message) {
            // console.log('response');
            return JSON.parse(message.response);
          },

          responseError(error) {
            // console.log('responseError');
            me.handleHttpErrors(error);
          }
        });
    });
  }

  handleHttpErrors(error) {
    let me = this;
    console.log('error: ', error);
    switch (error.statusCode) {
    case 0:
      Materialize.toast(
          'Server is not reachable. Please contact the system administrator',
          5000
        );
      break;

    case 401:
      localStorage.removeItem('currentUser');
      delete App.currentUser;
      me.aurelia.setRoot('login/login');
      Materialize.toast('User is Unathorized', 5000);
      break;

    case 413:
      Materialize.toast('File size is too large', 5000);
      break;

    default:
      error.responseType === 'json'
          ? Materialize.toast(JSON.stringify(error.response), 5000)
          : Materialize.toast(error.response, 5000);
      break;
    }
  }
}
