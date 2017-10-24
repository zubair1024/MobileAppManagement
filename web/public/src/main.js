import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  //initialise
  aurelia.start().then(a => {
    let rootComponent = isLoggedIn() ? 'app' : 'login/login';
    a.setRoot(rootComponent, document.body);
  });
}

function isLoggedIn() {

  if (localStorage.getItem('currentUser')) {
    return true
  } else {
    return false;
  }
}