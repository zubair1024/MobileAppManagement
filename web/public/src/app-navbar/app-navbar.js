import { Aurelia, inject } from 'aurelia-framework';
import { Http } from '../http';


@inject(Aurelia, Http)
export class AppNavbar {
  loading = true;
  user = {};
  alarmsCount = 0;

  constructor(aurelia, http) {
    let me = this;
    this.aurelia = aurelia;
    this.http = http;

    //once
    me.getAlarmsCount();
    //setup a poller
    this.alarmCountPoller = setInterval(() => {
      if (App.currentUser) {
        //  me.getAlarmsCount();
      }
    }, 10 * 1000);
  }

  /**
   * Once DOM is attached
   */
  attached() {
    console.info('navbar activate');
    let userData = localStorage.getItem('currentUser');

    if (!userData) {
      this.aurelia.setRoot('login/login');
    } else {
      App.currentUser = this.user = JSON.parse(userData);
    }
    this.loading = false;


    //create support dialog box
    $('#supportDialog').kendoDialog({
      width: '800rem',
      title: 'Contact Support',
      closable: true,
      modal: true,
      content: `<iframe title="Feedback Form" class="freshwidget-embedded-form" 
      id="freshwidget-embedded-form" src="https://razrlab.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=no" 
      scrolling="no" height="500px" width="100%" frameborder="0" ></iframe>`
    });

    $(this.supportDialog).data('kendoDialog') &&
      $(this.supportDialog).data('kendoDialog').close();
  }

  /**
   * Get Alarms Count
   */
  getAlarmsCount() {
    let me = this;
    this.http.client.get('/alarm/count').then(res => {
      if (res) {
        me.alarmsCount = res.data;
      }
    });
  }

  /**
   * User logout function
   */
  logout() {
    console.info('user logout');
    //login user
    this.http.client.post('/user/logout', this.model).then(res => {
      this.loading = false;
      if (res) {
        localStorage.removeItem('currentUser');
        delete App.currentUser;
        this.aurelia.setRoot('login/login');
      }
    });
  }

  /**
   * Diplay Help and Support Dialog
   */
  showSupportDialog() {
    $(this.supportDialog).data('kendoDialog') &&
      $(this.supportDialog).data('kendoDialog').open();
  }

  deattached() {
    console.log('navbar deattached');
    //clear out the poller
    clearInterval(this.alarmCountPoller);
  }
}
