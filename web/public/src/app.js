import { Aurelia, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
// import { Router, Redirect } from 'aurelia-router';
// import { AuthContext } from './auth-context';
// import { HttpClient } from 'aurelia-http-client';

@inject(Aurelia, Router)
export class Application {
  constructor(aurelia, router) {
    this.aurelia = aurelia;
    this.router = router;
    console.info('App const');
  }

  configureRouter(config, router) {
    config.title = 'RAZRGEN';
    App.currentUser;
    // var step = new AuthorizeStep;
    // config.addAuthorizeStep(step)
    // config.addPipelineStep('preRender', postRenderStep);
    config.addPipelineStep('postRender', postRenderStep);
    // config.addPipelineStep(' postRender', AuthorizeStep); // Add a route filter to the authorize extensibility point.
    config.map([
      {
        route: 'login',
        moduleId: 'login/login',
        name: 'Login'
      },
      {
        route: ['', 'overview'],
        name: 'overview',
        moduleId: 'overview/overview',
        title: 'Overview'
      },
      {
        route: 'profile',
        name: 'profile',
        moduleId: 'profile/profile',
        title: 'User Profile'
      },
      {
        route: 'administration',
        name: 'administration',
        moduleId: 'administration/administration',
        title: 'Administration'
      },
      {
        route: 'user-admin',
        name: 'user-admin',
        moduleId: 'user-admin/user-admin',
        title: 'User Administration'
      },
      {
        route: 'user-admin/:id',
        name: 'user-admin/:id',
        moduleId: 'user-admin/user-admin',
        title: 'User Administration'
      },
      {
        route: 'asset-list',
        name: 'asset-list',
        moduleId: 'asset-list/asset-list',
        title: 'Assets List'
      },
      {
        route: 'asset-list/:id',
        name: 'asset-list/:id',
        moduleId: 'asset-list/asset-list',
        title: 'Project Asset List'
      },
      {
        route: 'asset-admin',
        name: 'asset-admin',
        moduleId: 'asset-admin/asset-admin',
        title: 'Asset Administration'
      },
      {
        route: 'asset-admin/:id',
        name: 'asset-admin/:id',
        moduleId: 'asset-admin/asset-admin',
        title: 'Asset Administration'
      },
      {
        route: 'project-list',
        name: 'project-list',
        moduleId: 'project-list/project-list',
        title: 'Project List'
      },
      {
        route: 'project-admin',
        name: 'project-admin',
        moduleId: 'project-admin/project-admin',
        title: 'Project Administration'
      },
      {
        route: 'project-admin/:id',
        name: 'project-admin/:id',
        moduleId: 'project-admin/project-admin',
        title: 'Project Administration'
      },
      {
        route: 'asset-details/:id',
        name: 'asset-details',
        moduleId: 'asset-details/asset-details',
        title: 'Assets Details'
      },
      {
        route: 'alarms',
        name: 'alarms',
        moduleId: 'alarms/alarms',
        title: 'Alarms'
      },
      {
        route: 'map',
        name: 'map',
        moduleId: 'map/map',
        title: 'Map'
      },
      {
        route: 'locations',
        name: 'locations',
        moduleId: 'locations/locations',
        title: 'Locations'
      },
      {
        route: 'geofences',
        name: 'geofences',
        moduleId: 'geofences/geofences',
        title: 'Geofences'
      },
      {
        route: 'commands',
        name: 'commands',
        moduleId: 'commands/commands',
        title: 'Commands'
      },
      {
        route: 'report-asset-utilization',
        name: 'report-asset-utilization',
        moduleId: 'report-asset-utilization/report-asset-utilization',
        title: 'Asset Utilization'
      }
    ]);
    this.router = router;
  }

  activate() {
    console.info('app has been activated');
  }

  created(owningView, myView) {
    console.log('app created');

    // Invoked once the component is created...
  }

  bind(bindingContext, overrideContext) {
    console.info('app bind');

    // Invoked once the databinding is activated...
  }

  attached(argument) {
    console.info('app attached');
    let me = this;
    // Invoked once the component is attached to the DOM...

    //Main Left Sidebar Menu
    $('.sidebar-collapse').sideNav(
      {
        // edge: 'left' // Choose the horizontal origin
      }
    );

    // Materialize Slider
    $('.slider').slider({
      full_width: true
    });

    // Materialize Dropdown
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 125,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on click
      alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    });

    //collapsibles
    $('.collapsible').collapsible();

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

    //kendo strip
    $('#tabstrip').kendoTabStrip({
      animation: {
        open: {
          effects: 'fadeIn'
        }
      }
    });

    //tooltips
    $('.tooltipped').tooltip({ delay: 50 });

    //Ajax Prefilters for the widgets
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      options.error = function(data) {
        switch (data.status) {
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
          if (data.statusText) {
            Materialize.toast(data.statusText, 3000);
          }
          break;
        }
      };
    });
  }

  detached(argument) {
    console.info('app detached');

    // Invoked when component is detached from the dom
  }

  unbind(argument) {
    console.log('app unbind');

    // Invoked when component is unbound...
  }
}

// class AuthorizeStep {
//   run(navigationInstruction, next) {
//     console.warn('AuthorizeStep');
//     if (
//       navigationInstruction
//         .getAllInstructions()
//         .some(i => i.config.settings.auth)
//     ) {
//       console.log('AuthorizeStep');
//       // let isLoggedIn = false;
//       // console.log(isLoggedIn);
//       // if (!isLoggedIn) {
//       //   return next.cancel(new Redirect('login'));
//       // }
//     }
//     return next();
//   }
// }

class postRenderStep {
  run(navigationInstruction, next) {
    //Main Left Sidebar Menu
    $('.sidebar-collapse').sideNav({
      edge: 'left' // Choose the horizontal origin
    });

    //Main Left Sidebar Chat
    $('.chat-collapse').sideNav({
      menuWidth: 240,
      edge: 'right'
    });

    return next();
  }
}
