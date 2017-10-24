import { Aurelia, inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Aurelia, Http)
export class UserPassword {
  loading = false;
  loginBtnText = 'Login';

  model = {
    loginName: '',
    password: ''
  }

  constructor(aurelia, http) {
    this.aurelia = aurelia;
    this.client = http.client;
  }

  login() {
    let me = this;
    this.loading = true;
    this.loginBtnText = 'Logging in...';

    //login user
    this.client.post('/user/logon', this.model)
      .then(res => {
        me.loading = false;
        if (res) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.aurelia.setRoot('app');
        }
      });
  }
}
