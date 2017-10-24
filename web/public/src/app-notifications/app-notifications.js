import { Aurelia, inject } from 'aurelia-framework';
import { Http } from '../http';

@inject(Aurelia, Http)
export class AppNotifications {

  App = App;


  alarms = []
  notifications = []

  constructor(aurelia, http) {
    this.aurelia = aurelia;
    this.http = http;
    this.App = App;
  }
  attached() {
    console.log('notification bar');
    //Main Left Sidebar Menu
    $('.sidebar-collapse').sideNav({
      edge: 'left' // Choose the horizontal origin
    });

    //Main Left Sidebar Chat
    $('.chat-collapse').sideNav({
      menuWidth: 240,
      edge: 'right'
    });
    $('.chat-close-collapse').click(function() {
      $('.chat-collapse').sideNav('hide');
    });
    $('.chat-collapsible').collapsible({
      accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    // Perfect Scrollbar
    $('select').not('.disabled').material_select();
    let leftnav = $('.page-topbar').height();
    let leftnavHeight = window.innerHeight - leftnav;
    $('.leftside-navigation').height(leftnavHeight).perfectScrollbar({
      suppressScrollX: true
    });
    let righttnav = $('#chat-out').height();
    $('.rightside-navigation').height(righttnav).perfectScrollbar({
      suppressScrollX: true
    });

    this.getNotifications();

    //get user notifications
    setInterval(() => {
      this.getNotifications();
    }, 30000);
  }

  /**
   * Get notifications for the user
   */
  getNotifications() {
    // let me = this;
    this.alarms = [];
    this.notifications = [];
    if (App.currentUser && App.currentUser._id) {
      this.http.client.get(`/user/notifications/${App.currentUser._id}`).then(res => {
        if (res) {
          let cache = res.data.notificationCache;
          //loop through the notifications
          for (let i = 0; i < cache.length; i++) {
            if (cache[i].objectType) {
              switch (cache[i].objectType) {
              case 'Alarm':
                this.alarms.push(cache[i]);
                break;
              default:
                  //do nothing
                break;
              }
            }
          }
        }
      });
    }
  }

  /**
   * Dismiss a specific user notification
   * @param {*} id
   */
  dismissNotification(id) {
    let me = this;
    if (App.currentUser && App.currentUser._id) {
      this.http.client.post(`/user/notifications/dismiss/${App.currentUser._id}`, {
        id: id
      }).then(res => {
        if (res && res.message) {
          Materialize.toast(res.message, 3000);
        }
        me.getNotifications();
      });
    }
  }
}
