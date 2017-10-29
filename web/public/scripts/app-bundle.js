define('app',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Application = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Application = exports.Application = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaRouter.Router), _dec(_class = function () {
    function Application(aurelia, router) {
      _classCallCheck(this, Application);

      this.aurelia = aurelia;
      this.router = router;
      console.info('App const');
    }

    Application.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'RAZRGEN';
      App.currentUser;

      config.addPipelineStep('postRender', postRenderStep);

      config.map([{
        route: 'login',
        moduleId: 'login/login',
        name: 'Login'
      }, {
        route: ['', 'overview'],
        name: 'overview',
        moduleId: 'overview/overview',
        title: 'Overview'
      }, {
        route: 'profile',
        name: 'profile',
        moduleId: 'profile/profile',
        title: 'User Profile'
      }, {
        route: 'administration',
        name: 'administration',
        moduleId: 'administration/administration',
        title: 'Administration'
      }, {
        route: 'user-admin',
        name: 'user-admin',
        moduleId: 'user-admin/user-admin',
        title: 'User Administration'
      }, {
        route: 'user-admin/:id',
        name: 'user-admin/:id',
        moduleId: 'user-admin/user-admin',
        title: 'User Administration'
      }, {
        route: 'asset-list',
        name: 'asset-list',
        moduleId: 'asset-list/asset-list',
        title: 'Assets List'
      }, {
        route: 'asset-list/:id',
        name: 'asset-list/:id',
        moduleId: 'asset-list/asset-list',
        title: 'Project Asset List'
      }, {
        route: 'asset-admin',
        name: 'asset-admin',
        moduleId: 'asset-admin/asset-admin',
        title: 'Asset Administration'
      }, {
        route: 'asset-admin/:id',
        name: 'asset-admin/:id',
        moduleId: 'asset-admin/asset-admin',
        title: 'Asset Administration'
      }, {
        route: 'project-list',
        name: 'project-list',
        moduleId: 'project-list/project-list',
        title: 'Project List'
      }, {
        route: 'project-admin',
        name: 'project-admin',
        moduleId: 'project-admin/project-admin',
        title: 'Project Administration'
      }, {
        route: 'project-admin/:id',
        name: 'project-admin/:id',
        moduleId: 'project-admin/project-admin',
        title: 'Project Administration'
      }, {
        route: 'asset-details/:id',
        name: 'asset-details',
        moduleId: 'asset-details/asset-details',
        title: 'Assets Details'
      }, {
        route: 'alarms',
        name: 'alarms',
        moduleId: 'alarms/alarms',
        title: 'Alarms'
      }, {
        route: 'map',
        name: 'map',
        moduleId: 'map/map',
        title: 'Map'
      }, {
        route: 'locations',
        name: 'locations',
        moduleId: 'locations/locations',
        title: 'Locations'
      }, {
        route: 'geofences',
        name: 'geofences',
        moduleId: 'geofences/geofences',
        title: 'Geofences'
      }, {
        route: 'commands',
        name: 'commands',
        moduleId: 'commands/commands',
        title: 'Commands'
      }, {
        route: 'report-asset-utilization',
        name: 'report-asset-utilization',
        moduleId: 'report-asset-utilization/report-asset-utilization',
        title: 'Asset Utilization'
      }, {
        route: 'ad-list',
        name: 'ad-list',
        moduleId: 'ad-list/ad-list',
        title: 'Ads List'
      }, {
        route: 'ad-admin',
        name: 'ad-admin',
        moduleId: 'ad-admin/ad-admin',
        title: 'Ad Admin'
      }]);
      this.router = router;
    };

    Application.prototype.activate = function activate() {
      console.info('app has been activated');
    };

    Application.prototype.created = function created(owningView, myView) {
      console.log('app created');
    };

    Application.prototype.bind = function bind(bindingContext, overrideContext) {
      console.info('app bind');
    };

    Application.prototype.attached = function attached(argument) {
      console.info('app attached');
      var me = this;

      $('.sidebar-collapse').sideNav({});

      $('.slider').slider({
        full_width: true
      });

      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 125,
        constrain_width: true,
        hover: false,
        alignment: 'left',
        gutter: 0,
        belowOrigin: true });

      $('.collapsible').collapsible();

      $('.chat-close-collapse').click(function () {
        $('.chat-collapse').sideNav('hide');
      });

      $('.chat-collapsible').collapsible({
        accordion: false });

      $('select').not('.disabled').material_select();
      var leftnav = $('.page-topbar').height();
      var leftnavHeight = window.innerHeight - leftnav;
      $('.leftside-navigation').height(leftnavHeight).perfectScrollbar({
        suppressScrollX: true
      });
      var righttnav = $('#chat-out').height();
      $('.rightside-navigation').height(righttnav).perfectScrollbar({
        suppressScrollX: true
      });

      $('#tabstrip').kendoTabStrip({
        animation: {
          open: {
            effects: 'fadeIn'
          }
        }
      });

      $('.tooltipped').tooltip({ delay: 50 });

      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.error = function (data) {
          switch (data.status) {
            case 0:
              Materialize.toast('Server is not reachable. Please contact the system administrator', 5000);
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
    };

    Application.prototype.detached = function detached(argument) {
      console.info('app detached');
    };

    Application.prototype.unbind = function unbind(argument) {
      console.log('app unbind');
    };

    return Application;
  }()) || _class);

  var postRenderStep = function () {
    function postRenderStep() {
      _classCallCheck(this, postRenderStep);
    }

    postRenderStep.prototype.run = function run(navigationInstruction, next) {
      $('.sidebar-collapse').sideNav({
        edge: 'left' });

      $('.chat-collapse').sideNav({
        menuWidth: 240,
        edge: 'right'
      });

      return next();
    };

    return postRenderStep;
  }();
});
define('appState',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AppState = exports.AppState = function AppState() {
    _classCallCheck(this, AppState);

    var me = this;
    this.loggedInUser = null;

    this.config = {
      apiUrl: 'http://localhost:8080',

      features: {
        engineStatus: {
          enabled: true
        },
        inUse: {
          enabled: true
        },
        nonReport: {
          enabled: true,
          alarmFeature: true,
          threshold: 10
        },
        hasMapPosition: {
          enabled: true
        },
        powerOutputKW: {
          enabled: true
        }
      },
      grid: {
        toolbar: ['excel', 'pdf'],
        excel: {
          filterable: true
        },

        filterMenuInit: function filterMenuInit(e) {
          if (e.sender.dataSource.options.schema.model.fields[e.field] && e.sender.dataSource.options.schema.model.fields[e.field].type == 'date') {
            var beginOperator = e.container.find('[data-role=dropdownlist]:eq(0)').data('kendoDropDownList');
            beginOperator.value('gte');
            beginOperator.trigger('change');
            beginOperator.readonly();

            var logicOperator = e.container.find('[data-role=dropdownlist]:eq(1)').data('kendoDropDownList');
            logicOperator.readonly();

            var endOperator = e.container.find('[data-role=dropdownlist]:eq(2)').data('kendoDropDownList');
            endOperator.value('lte');
            endOperator.trigger('change');
            beginOperator.readonly();
          }
        },
        columnMenu: true,
        dataSource: {
          type: 'odata',
          transport: {
            read: {
              type: 'GET',
              contentType: 'application/json',
              accept: 'application/json, text/plain, */*',
              dataType: 'json',
              xhrFields: { withCredentials: true }
            },
            error: function error(e) {
              void 0;
            }
          },
          schema: {
            data: 'data.docs',
            total: 'data.total',
            model: {
              fields: {
                eventTime: { type: 'date' },
                createdTime: { type: 'date' },
                updated_at: { type: 'date' },
                created_at: { type: 'date' }
              }
            }
          },
          pageSize: 25,
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true
        },
        dataBound: function dataBound() {
          var grid = this;
          setTimeout(function () {
            for (var i = 0; i < grid.columns.length; i++) {
              grid.autoFitColumn(i);
            }
          }, 1);
        },
        height: 800,
        groupable: true,
        reorderable: true,
        resizable: true,
        sortable: true,
        pageable: {
          refresh: true,
          pageSizes: true,
          buttonCount: 5
        },
        filterable: {
          extra: false,
          operators: {
            string: {
              contains: 'Contains'
            },
            date: {
              gte: 'Begin Date',
              lte: 'End Date'
            }
          }
        }
      },

      generatorFrequency: [50, 60],
      generatorStatus: ['Deployed', 'Maintenance', 'Decommissioned', 'Ready for deployment'],

      generatorEngineRating: ['Prime', 'Continuous', 'Standby'],

      locationTypes: ['construction-site', 'address', 'bank', 'border crossing', 'building', 'city', 'clinic', 'collection-site', 'compost-plant', 'country', 'customer', 'customer service center', 'depot', 'distribution center'],

      geofenceTypes: ['inclusive', 'exclusive'],

      userRole: ['Administrator', 'Operator'],
      volume: ['l', 'gal'],
      distance: ['km', 'mi'],
      pressure: ['psi', 'bar'],
      speed: ['km/hr', 'mi/hr'],
      temperature: ['Celsius', 'Fahrenheit'],
      dateTimeFormat: ['D/MM/YYYY h:mm:ss a', 'MM/D/YYYY h:mm:ss a', 'YYYY-MM-DD h:mm:ss a', 'YYYY-MM-DD h:mm:ss a', 'YYYY-MM-DD HH:mm:ss Z'],
      dateFormat: ['D/MM/YYYY', 'MM/D/YYYY', 'YYYY-MM-DD'],
      timeFormat: ['h:mm:ss a', 'HH:mm:ss']
    };
  };
});
define('auth-context',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AuthContext = exports.AuthContext = function AuthContext() {
        _classCallCheck(this, AuthContext);
    };
});
define('auth-guard',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AuthGuard = exports.AuthGuard = function () {
        function AuthGuard() {
            _classCallCheck(this, AuthGuard);

            console.log('auth guard const');
        }

        AuthGuard.prototype.activate = function activate() {
            console.info('auth guard was called');
            var active = void 0;
            if (localStorage.getItem('currentUser')) {
                console.warn('user is logged in');
            } else {
                console.log('user is not logged in');
            }
        };

        return AuthGuard;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: false
  };
});
define('http',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Http = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Http = exports.Http = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaHttpClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function Http(aurelia, client, router) {
      _classCallCheck(this, Http);

      var me = this;
      this.client = client;
      this.aurelia = aurelia;
      this.router = router;
      console.log('client contructor');

      this.client.configure(function (x) {
        x.withBaseUrl(App.config.apiUrl);
        x.withHeader('Access-Control-Allow-Credentials', 'application/json').withHeader('content-type', 'application/json').withHeader('Accept', 'application/json, text/plain, */*').withCredentials(true).withInterceptor({
          request: function request(message) {
            return message;
          },
          requestError: function requestError(error) {
            throw error;
          },
          response: function response(message) {
            return JSON.parse(message.response);
          },
          responseError: function responseError(error) {
            me.handleHttpErrors(error);
          }
        });
      });
    }

    Http.prototype.handleHttpErrors = function handleHttpErrors(error) {
      var me = this;
      console.log('error: ', error);
      switch (error.statusCode) {
        case 0:
          Materialize.toast('Server is not reachable. Please contact the system administrator', 5000);
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
          error.responseType === 'json' ? Materialize.toast(JSON.stringify(error.response), 5000) : Materialize.toast(error.response, 5000);
          break;
      }
    };

    return Http;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function (a) {
      var rootComponent = isLoggedIn() ? 'app' : 'login/login';
      a.setRoot(rootComponent, document.body);
    });
  }

  function isLoggedIn() {

    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }
});
define('ad-admin/ad-admin',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _http, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BlobToUrlValueConverter = exports.FileListToArrayValueConverter = exports.AdAdmin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AdAdmin = exports.AdAdmin = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function AdAdmin(http, httpClient) {
      _classCallCheck(this, AdAdmin);

      this.loading = true;
      this.model = {};
      this.update = false;
      this.validation = {};

      this.client = http.client;
      this.fetchAPI = httpClient;
    }

    AdAdmin.prototype.activate = function activate(params) {
      var _this = this;

      if (params.id) {
        this.update = true;
        this.client.get('/ad/id/' + params.id).then(function (res) {
          _this.loading = false;
          if (res && res.data) {
            _this.model = $.extend(true, _this.model, res.data[0]);

            _this.tagger.add(_this.model.tags);
          }
        });
      } else {
        this.loading = false;
      }
    };

    AdAdmin.prototype.attached = function attached() {
      var me = this;

      this.tagger = new Taggle('admin-tags', {
        allowDuplicates: false
      });
    };

    AdAdmin.prototype.delete = function _delete() {
      var _this2 = this;

      this.client.delete('/ad/id/' + this.model._id).then(function (data) {
        _this2.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);

          window.location.hash = '#/ad-list';
        }
      });
    };

    AdAdmin.prototype.validateInformation = function validateInformation(images) {
      var me = this;
      this.loading = true;
      console.log('validateInformation');
      var valid = true;

      this.validation.name = false;
      this.validation.linkedUrl = false;

      if (!this.model.name || this.model.name === '') {
        valid = false;
        this.validation.name = true;
      }

      if (!this.model.linkedUrl || this.model.linkedUrl === '') {
        valid = false;
        this.validation.linkedUrl = true;
      }

      if (valid) {
        if (me.tagger) {
          me.model.tags = me.tagger.getTags().values;
        }

        var formData = new FormData();
        if (me.images) {
          formData.append('images', me.images[0], 'deed_' + me.model.name + '.jpg');
        }
        formData.append('model', JSON.stringify(me.model));

        if (!this.update) {
          $.ajax({
            url: 'http://localhost/ad',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function success(data) {
              if (data) {
                Materialize.toast(data, 5000);

                window.location.hash = '#/ad-list';
              }
            },
            error: function error(err) {
              console.log(err);
            }
          });
        }
      } else {
        Materialize.toast('Please fill up all the necessary information', 3000);
      }
    };

    return AdAdmin;
  }()) || _class);

  var FileListToArrayValueConverter = exports.FileListToArrayValueConverter = function () {
    function FileListToArrayValueConverter() {
      _classCallCheck(this, FileListToArrayValueConverter);
    }

    FileListToArrayValueConverter.prototype.toView = function toView(fileList) {
      var files = [];
      if (!fileList) {
        return files;
      }
      for (var i = 0; i < fileList.length; i++) {
        files.push(fileList.item(i));
      }
      return files;
    };

    return FileListToArrayValueConverter;
  }();

  var BlobToUrlValueConverter = exports.BlobToUrlValueConverter = function () {
    function BlobToUrlValueConverter() {
      _classCallCheck(this, BlobToUrlValueConverter);
    }

    BlobToUrlValueConverter.prototype.toView = function toView(blob) {
      return URL.createObjectURL(blob);
    };

    return BlobToUrlValueConverter;
  }();
});
define('ad-list/ad-list',['exports', 'aurelia-framework', '../http', 'chart.js', 'aurelia-router'], function (exports, _aureliaFramework, _http, _chart, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AdList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AdList = exports.AdList = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaRouter.Router), _dec(_class = function () {
    function AdList(http, router) {
      _classCallCheck(this, AdList);

      this.project = {};
      this.cards = {};

      this.http = http;
      this.router = router;
      this.user = App.currentUser;
    }

    AdList.prototype.attached = function attached() {
      var _this = this;

      var me = this;

      this.tagger = new Taggle('list-tags', {
        allowDuplicates: false,

        onTagAdd: function onTagAdd(event, tag) {
          if (me.tagger) {
            me.renderGrid(me.tagger.getTags().values);
          }
        },

        onTagRemove: function onTagRemove(event, tag) {
          me.renderGrid(me.tagger.getTags().values);
        }
      });

      if (this.router.currentInstruction.params && this.router.currentInstruction.params.id) {
        var id = this.router.currentInstruction.params.id;
        this.getProject(id, function () {
          _this.loading = false;
          _this.deferred();
        });
      } else {
        this.deferred();
      }
    };

    AdList.prototype.deferred = function deferred() {
      var me = this;

      me.renderGrid();
    };

    AdList.prototype.renderGrid = function renderGrid(tags) {
      var config = $.extend(true, {
        detailTemplate: kendo.template($('#template').html()),
        columns: [{
          template: "<a href='\\#ad-admin/#:_id#'>#:name#</a>",
          field: 'name',
          title: 'Ad Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'updatedTime',
          title: 'Modified Time',
          template: '#: App.util.format.dateTime(data.updatedTime, App.currentUser.dateTimeFormat) #',
          filterable: {
            extra: 'true',
            messages: {
              info: 'Show items between dates:'
            }
          }
        }]
      }, App.config.grid);

      if (App.currentUser.privileges.indexOf(1) > -1) {
        config.toolbar.push({
          template: '<a class="k-button" href="\\#/ad-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
        });
      }

      if (tags) {
        config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/ad';

      if (this.project._id && this.project.assets) {
        config.dataSource.filter = $.extend(config.dataSource.filter, {
          field: 'ids',
          operator: 'eq',
          value: this.project.assets.join(',')
        });
      }

      this.grid = $('#assetGrid').kendoGrid(config);
    };

    return AdList;
  }()) || _class);
});
define('administration/administration',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Administration = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Administration = exports.Administration = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function Administration(http) {
      _classCallCheck(this, Administration);

      this.http = http;
    }

    Administration.prototype.attached = function attached() {
      App.currentView = this;

      $('.tabstrip').kendoTabStrip({
        animation: {
          open: {
            effects: 'fadeIn'
          }
        }
      });

      this.renderUsers();
    };

    Administration.prototype.renderUsers = function renderUsers(tags) {
      var config = $.extend(true, {
        detailTemplate: kendo.template($('#template').html()),
        columns: [{
          field: 'loginName',
          title: 'Login Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'name',
          title: 'Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'firstName',
          title: 'First Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'lastName',
          title: 'Last Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'phoneNo',
          title: 'Phone Number',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'updated_at',
          title: 'Modified Time',
          template: "# if (updated_at){# #: moment(updated_at).format('DD/M/YYYY h:mm:ss a') # #}#",
          filterable: {
            extra: 'true',
            messages: {
              info: 'Show items between dates:'
            }
          }
        }]
      }, App.config.grid);

      config.toolbar.push({
        template: '<a class="k-button" href="\\#/user-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
      });

      if (tags) {
        config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/user';

      this.grid = $('#appUsers').kendoGrid(config);
    };

    return Administration;
  }()) || _class);
});
define('alarms/alarms',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Alarms = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Alarms = exports.Alarms = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function Alarms(http) {
      _classCallCheck(this, Alarms);

      this.http = http;
    }

    Alarms.prototype.attached = function attached() {
      App.currentView = this;

      this.renderAlarms();
    };

    Alarms.prototype.renderAlarms = function renderAlarms() {
      var me = this;

      var config = $.extend(true, {
        columns: [{
          field: '_asset.name',
          title: 'Asset',
          template: "# if (_asset) { # <a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a> #}#"
        }, { field: 'name', title: 'Alarm' }, {
          field: 'triggerTime',
          title: 'Trigger Time',
          template: '#: App.util.format.dateTime(data.triggerTime, App.currentUser.dateTimeFormat) #'
        }]
      }, App.config.grid);

      config.dataBound = function () {};

      if (App.currentUser.privileges.indexOf(5) > -1) {
        config.columns.push({
          command: { text: 'Reset', click: me.acknowledgeAlarm },
          title: 'Command',
          width: '100px'
        });
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';

      config.dataSource.filter = { field: 'triggered', operator: 'eq', value: true };

      this.grid = $('#alarms').kendoGrid(config);
    };

    Alarms.prototype.acknowledgeAlarm = function acknowledgeAlarm(e) {
      e.preventDefault();

      var dataItem = this.dataItem($(e.currentTarget).closest('tr'));

      kendo.prompt('Please, enter a comment', '').then(function (data) {
        $.ajax({
          method: 'PUT',
          url: App.config.apiUrl + '/alarm/reset',
          data: { _id: dataItem._id, msg: data, alarm: dataItem.toJSON() },
          success: function success(res) {
            kendo.alert('Acknowledgement sucessful');

            App.currentView.renderAlarms();
          },
          error: function error(err) {
            me.renderAlarms();
          }
        });
      }, function () {
        kendo.alert('Acknowledgement cancelled');
      });
    };

    return Alarms;
  }()) || _class);
});
define('app-footer/app-footer',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AppFooter = exports.AppFooter = function AppFooter() {
        _classCallCheck(this, AppFooter);
    };
});
define('app-header/app-header',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AppHeader = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AppHeader = exports.AppHeader = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function AppHeader(router) {
      _classCallCheck(this, AppHeader);

      this.router = router;
    }

    AppHeader.prototype.attached = function attached() {
      this.renderUniversalSearch();
    };

    AppHeader.prototype.renderUniversalSearch = function renderUniversalSearch() {
      var me = this;

      $('#universal-search').kendoAutoComplete({
        dataTextField: 'name',
        ignoreCase: false,
        filter: 'contains',
        minLength: 3,
        placeholder: 'Search...',
        dataSource: {
          type: 'odata',
          serverFiltering: true,
          transport: {
            read: {
              type: 'GET',
              contentType: 'application/json',
              accept: 'application/json, text/plain, */*',
              dataType: 'json',
              xhrFields: { withCredentials: true },
              url: App.config.apiUrl + '/misc/find/'
            }
          }
        },
        template: '# if(data.objectType=="Ad"){ # <i class="mdi-image-flash-on tiny"></i> # } else {# <i class="mdi-communication-business tiny"></i> #}# #: data.name #',
        select: function select(e) {
          if (e.dataItem.objectType) {
            console.log(e.dataItem.objectType);
            switch (e.dataItem.objectType) {
              case 'Asset':
                me.router.navigateToRoute('ad-admin', { id: e.dataItem._id });
                break;
              case 'Project':
                me.router.navigateToRoute('ad-list/:id', { id: e.dataItem._id });
                break;
              default:
                break;
            }
          }
        }
      });
    };

    AppHeader.prototype.toggleFullScreen = function toggleFullScreen() {
      console.log(document);
      if (document.fullScreenElement && document.fullScreenElement !== null || !document.mozFullScreen && !document.webkitIsFullScreen) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    };

    return AppHeader;
  }()) || _class);
});
define('app-navbar/app-navbar',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AppNavbar = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AppNavbar = exports.AppNavbar = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _http.Http), _dec(_class = function () {
    function AppNavbar(aurelia, http) {
      _classCallCheck(this, AppNavbar);

      this.loading = true;
      this.user = {};
      this.alarmsCount = 0;

      var me = this;
      this.aurelia = aurelia;
      this.http = http;
    }

    AppNavbar.prototype.attached = function attached() {
      console.info('navbar activate');
      var userData = localStorage.getItem('currentUser');

      if (!userData) {
        this.aurelia.setRoot('login/login');
      } else {
        App.currentUser = this.user = JSON.parse(userData);
      }
      this.loading = false;

      $('#supportDialog').kendoDialog({
        width: '800rem',
        title: 'Contact Support',
        closable: true,
        modal: true,
        content: '<iframe title="Feedback Form" class="freshwidget-embedded-form" \n      id="freshwidget-embedded-form" src="https://razrlab.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=no" \n      scrolling="no" height="500px" width="100%" frameborder="0" ></iframe>'
      });

      $(this.supportDialog).data('kendoDialog') && $(this.supportDialog).data('kendoDialog').close();
    };

    AppNavbar.prototype.getAlarmsCount = function getAlarmsCount() {
      var me = this;
      this.http.client.get('/alarm/count').then(function (res) {
        if (res) {
          me.alarmsCount = res.data;
        }
      });
    };

    AppNavbar.prototype.logout = function logout() {
      var _this = this;

      console.info('user logout');

      this.http.client.post('/user/logout', this.model).then(function (res) {
        _this.loading = false;
        if (res) {
          localStorage.removeItem('currentUser');
          delete App.currentUser;
          _this.aurelia.setRoot('login/login');
        }
      });
    };

    AppNavbar.prototype.showSupportDialog = function showSupportDialog() {
      $(this.supportDialog).data('kendoDialog') && $(this.supportDialog).data('kendoDialog').open();
    };

    AppNavbar.prototype.deattached = function deattached() {
      console.log('navbar deattached');

      clearInterval(this.alarmCountPoller);
    };

    return AppNavbar;
  }()) || _class);
});
define('app-notifications/app-notifications',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AppNotifications = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AppNotifications = exports.AppNotifications = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _http.Http), _dec(_class = function () {
    function AppNotifications(aurelia, http) {
      _classCallCheck(this, AppNotifications);

      this.App = App;
      this.alarms = [];
      this.notifications = [];

      this.aurelia = aurelia;
      this.http = http;
      this.App = App;
    }

    AppNotifications.prototype.attached = function attached() {
      console.log('notification bar');

      $('.sidebar-collapse').sideNav({
        edge: 'left' });

      $('.chat-collapse').sideNav({
        menuWidth: 240,
        edge: 'right'
      });
      $('.chat-close-collapse').click(function () {
        $('.chat-collapse').sideNav('hide');
      });
      $('.chat-collapsible').collapsible({
        accordion: false });

      $('select').not('.disabled').material_select();
      var leftnav = $('.page-topbar').height();
      var leftnavHeight = window.innerHeight - leftnav;
      $('.leftside-navigation').height(leftnavHeight).perfectScrollbar({
        suppressScrollX: true
      });
      var righttnav = $('#chat-out').height();
      $('.rightside-navigation').height(righttnav).perfectScrollbar({
        suppressScrollX: true
      });
    };

    AppNotifications.prototype.getNotifications = function getNotifications() {
      var _this = this;

      this.alarms = [];
      this.notifications = [];
      if (App.currentUser && App.currentUser._id) {
        this.http.client.get('/user/notifications/' + App.currentUser._id).then(function (res) {
          if (res) {
            var cache = res.data.notificationCache;

            for (var i = 0; i < cache.length; i++) {
              if (cache[i].objectType) {
                switch (cache[i].objectType) {
                  case 'Alarm':
                    _this.alarms.push(cache[i]);
                    break;
                  default:
                    break;
                }
              }
            }
          }
        });
      }
    };

    AppNotifications.prototype.dismissNotification = function dismissNotification(id) {
      var me = this;
      if (App.currentUser && App.currentUser._id) {
        this.http.client.post('/user/notifications/dismiss/' + App.currentUser._id, {
          id: id
        }).then(function (res) {
          if (res && res.message) {
            Materialize.toast(res.message, 3000);
          }
          me.getNotifications();
        });
      }
    };

    return AppNotifications;
  }()) || _class);
});
define('asset-admin/asset-admin',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _http, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssetAdmin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AssetAdmin = exports.AssetAdmin = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function AssetAdmin(http, httpClient) {
      _classCallCheck(this, AssetAdmin);

      this.loading = true;
      this.model = {
        features: App.config.features
      };
      this.update = false;

      this.client = http.client;
      this.fetchAPI = httpClient;
    }

    AssetAdmin.prototype.activate = function activate(params) {
      var _this = this;

      if (params.id) {
        this.update = true;
        this.client.get('/asset/id/' + params.id).then(function (res) {
          _this.loading = false;
          if (res && res.data) {
            _this.model = $.extend(true, _this.model, res.data[0]);

            _this.tagger.add(_this.model.tags);

            if (_this.model.generatorFrequency) {
              $(_this.generatorFrequency).data('kendoDropDownList').value(_this.model.generatorFrequency);
            }
            if (_this.model.generatorEngineRating) {
              $(_this.generatorEngineRating).data('kendoDropDownList').value(_this.model.generatorEngineRating);
            }
            if (_this.model.status) {
              $(_this.status).data('kendoDropDownList').value(_this.model.status);
            }
            if (_this.model.interfaceType) {
              $(_this.interfaceType).data('kendoDropDownList').value(_this.model.interfaceType);
            }
          }
        });
      } else {
        this.loading = false;
      }
    };

    AssetAdmin.prototype.attached = function attached() {
      var me = this;

      this.tagger = new Taggle('admin-tags', {
        allowDuplicates: false
      });

      $(this.generatorFrequency).kendoDropDownList({
        dataSource: App.config.generatorFrequency,

        change: function change() {
          me.model.generatorFrequency = this.value();
        }
      });

      $(this.generatorEngineRating).kendoDropDownList({
        dataSource: App.config.generatorEngineRating,

        change: function change() {
          me.model.generatorEngineRating = this.value();
        }
      });

      $(this.status).kendoDropDownList({
        dataSource: App.config.generatorStatus,

        change: function change() {
          me.model.status = this.value();
        }
      });

      $(this.interfaceType).kendoDropDownList({
        dataSource: App.config.interfaceType,

        change: function change() {
          me.model.interfaceType = this.value();
        }
      });
    };

    AssetAdmin.prototype.uploadAssetImage = function uploadAssetImage(images) {
      console.log('uploadAssetImage');
      if (images && images[0]) {
        var image = images[0];
        var filename = void 0;

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
          var me = this;

          var formData = new FormData();
          formData.append('images', image, filename);
          formData.append('_id', this.model._id);

          this.fetchAPI.fetch(App.config.apiUrl + '/asset/photo', {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (data) {
              Materialize.toast('Asset image uploaded successfully.', 3000);
            }
          }).catch(function (error) {
            return Materialize.toast(error.message, 5000);
          });
        }
      } else {
        Materialize.toast('Please upload an image.', 2000);
      }
    };

    AssetAdmin.prototype.submit = function submit() {
      var _this2 = this;

      this.loading = true;

      if (this.tagger) {
        this.model.tags = this.tagger.getTags().values;
      }

      if (this.update) {
        this.client.put('/asset/id/' + this.model._id, this.model).then(function (data) {
          _this2.loading = false;
          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/asset-list';
          }
        });
      } else {
        this.client.post('/asset/', this.model).then(function (data) {
          _this2.loading = false;
          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/asset-list';
          }
        });
      }
    };

    AssetAdmin.prototype.delete = function _delete() {
      var _this3 = this;

      this.client.delete('/asset/id/' + this.model._id).then(function (data) {
        _this3.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);

          window.location.hash = '#/asset-list';
        }
      });
    };

    return AssetAdmin;
  }()) || _class);
});
define('asset-details/asset-details',['exports', 'aurelia-framework', '../http', 'chart.js'], function (exports, _aureliaFramework, _http, _chart) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssetDetails = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AssetDetails = exports.AssetDetails = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function AssetDetails(http) {
      _classCallCheck(this, AssetDetails);

      this.loading = true;
      this.model = {};
      this.mapControl = {
        refreshInterval: 20000,
        autoRefresh: true,
        autoPan: true,
        autoZoom: false,
        autoCluster: true
      };
      this.markers = [];
      this.stats = {
        controls: {
          averagePowerOutput: false,
          averageFuelConsumed: false
        },
        averagePowerOutput: '43 kVA/Hr',
        averageFuelConsumed: '5 L/Hr',
        data: {
          averagePowerOutput: {
            false: '43 kVA/Hr',
            true: '282 kVA/Day'
          },
          averageFuelConsumed: {
            false: '5 L/Hr',
            true: '40 L/Day'
          }
        }
      };
      this.commands = {
        remoteStartStop: {
          status: 'ON',
          timestamp: '6/5/2017 04:31:33 am'
        },
        ping: {
          timestamp: '1/4/2017 04:31:33 am'
        }
      };

      App.currentView = this;
      this.http = http;
    }

    AssetDetails.prototype.activate = function activate(params) {
      var _this = this;

      if (params && params.id) {
        this.getAsset(params.id, function () {
          _this.loading = false;
          _this.deferred();
        });
      }
    };

    AssetDetails.prototype.attached = function attached() {
      $('#tabstrip').kendoTabStrip({
        animation: {
          open: {
            effects: 'fadeIn'
          }
        }
      });

      $('.collapsible').collapsible();

      this.setCommandStatuses();
    };

    AssetDetails.prototype.getAsset = function getAsset(id, callback) {
      var _this2 = this;

      this.http.client.get('/asset/id/' + id).then(function (res) {
        if (res && res.data) {
          _this2.model = res.data[0];
          callback();
        }
      });
    };

    AssetDetails.prototype.deferred = function deferred() {
      var _this3 = this;

      var me = this;

      this.renderLine();
      this.renderFuelLevelGauge();

      this.initMap(function () {
        setTimeout(function () {
          google.maps.event.trigger(me.googleMap, 'resize');
        }, 500);

        _this3.renderAssetMarker(function () {});
      });
    };

    AssetDetails.prototype.initMap = function initMap(callback) {
      console.log('initMap');

      this.latlngBounds = new google.maps.LatLngBounds();

      this.googleMap = new google.maps.Map(document.getElementById('assetOverviewMap'), {
        zoom: 3,
        center: { lat: 25, lng: 55 },

        mapTypeId: 'satellite',
        mapTypeControl: true,
        scrollwheel: true,
        draggable: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: false,
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
        }
      });

      this.renderLegend(this.googleMap);

      callback();
    };

    AssetDetails.prototype.renderLegend = function renderLegend(map) {
      var legend = this.legend;
      legend.innerHTML = '\n        <div class=\'card map-legend\'>\n          <h7>Legend</h7>\n          <ul>\n            <li><img src="/images/map/icons/on-sm.png"> ON</li>\n            <li><img src="/images/map/icons/off-sm.png"> OFF</li>\n            <li><img src="/images/map/icons/alert-sm.png"> Alarmed</li>\n            <li><img src="/images/map/icons/maintenance-sm.png"> Maintenance</li>\n            <li><img src="/images/map/icons/unknown-sm.png"> Unknown</li>\n            <li><img src="/images/map/icons/decommissioned-sm.png"> Decommissioned</li>\n          </ul>\n        </div>\n        ';
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    };

    AssetDetails.prototype.renderAssetMarker = function renderAssetMarker(callback) {
      var me = this;
      if (this.markerCluster) {
        this.removeCluster();
      }

      this.markers = [];

      this.http.client.get('/map/assets/?ids=' + this.model._id).then(function (res) {
        if (res) {
          var _loop = function _loop(i) {
            var markerInfo = res.data[i];
            var infowindow = new google.maps.InfoWindow({
              content: '\n                            <div id="map-tabstrip">\n                            <ul>\n                                <li class="k-state-active">\n                                    Event Info\n                                </li>\n                                <li>\n                                    Asset Info\n                                </li>\n                            </ul>\n                            <div>\n                               <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Name</b></td>\n                                            <td><a href=\'#asset-details/' + markerInfo._asset._id + '\'>' + markerInfo._asset.name + '</a></td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Status</b></td>\n                                            <td>' + (markerInfo._asset.status || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Type</b></td>\n                                            <td>' + markerInfo.eventType + '</td>\n                                            </tr>\n                                            <tr>\n                                           <td><b>Event Time</b></td>\n                                            <td>' + App.util.format.dateTime(markerInfo.eventTime, App.currentUser.dateTimeFormat) + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Position</b></td>\n                                            <td>' + markerInfo.latitude + ', ' + markerInfo.longitude + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                            <div>\n                                <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Engine Status</b></td>\n                                            <td>' + (markerInfo.engineStatus || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Engine Hour Meter</b></td>\n                                            <td>' + (markerInfo.engineHourMeter || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Supply Voltage</b></td>\n                                            <td>' + (markerInfo.powerSupplyVoltage || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Coolant Temperature</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.engineCoolantTemperature, 'temperature') || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Oil Pressure</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.oilPressure, 'pressure') || '-') + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                        </div>\n                                    '
            });

            var iconUrl = '/images/map/icons/unknown.png';
            if (markerInfo._asset.status && markerInfo._asset.status !== 'Deployed') {
              switch (markerInfo._asset.status) {
                case 'Maintenance':
                  iconUrl = '/images/map/icons/maintenance.png';
                  break;

                case 'Decommissioned':
                  iconUrl = '/images/map/icons/decommissioned.png';
                  break;

                default:
                  break;
              }
            } else {
              if (markerInfo._asset && markerInfo._asset.features.engineStatus) {
                switch (markerInfo._asset.features.engineStatus.value) {
                  case 'on':
                    iconUrl = '/images/map/icons/on.png';
                    break;

                  case 'off':
                    iconUrl = '/images/map/icons/off.png';
                    break;

                  default:
                    break;
                }
              }
            }

            var marker = new google.maps.Marker({
              position: {
                lat: parseFloat(markerInfo.latitude),
                lng: parseFloat(markerInfo.longitude)
              },
              title: markerInfo.assetName,
              icon: iconUrl,
              map: me.googleMap,
              id: markerInfo._id
            });

            marker.addListener('click', function () {
              infowindow.open(me.googleMap, marker);
            });

            google.maps.event.addListener(infowindow, 'domready', function (e) {
              $('#map-tabstrip').kendoTabStrip({
                animation: {
                  open: {
                    effects: 'fadeIn'
                  }
                }
              });

              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();

              iwBackground.children(':nth-child(2)').css({ display: 'none' });

              iwBackground.children(':nth-child(4)').css({ display: 'none' });
            });

            me.markers.push(marker);

            me.latlngBounds.extend({
              lat: parseFloat(markerInfo.latitude),
              lng: parseFloat(markerInfo.longitude)
            });
          };

          for (var i = 0; i < res.data.length; i++) {
            _loop(i);
          }

          if (me.mapControl.autoPan) {
            me.autoPan();
          }

          if (me.mapControl.autoCluster) {
            me.addClusters();
          }

          callback && callback();
        }
      });
    };

    AssetDetails.prototype.autoPan = function autoPan() {
      var len = this.markers.length;
      for (var i = 0; i < len; i++) {
        this.markers[i].map && this.latlngBounds.extend(this.markers[i].position);
      }

      this.googleMap.fitBounds(this.latlngBounds);
    };

    AssetDetails.prototype.addClusters = function addClusters() {
      this.markerClusterer = new MarkerClusterer(this.googleMap, this.markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    };

    AssetDetails.prototype.renderChart = function renderChart() {
      var ctx = document.getElementById('myChart');
      this.pieChart = new _chart.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [{
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        }

      });
    };

    AssetDetails.prototype.renderLine = function renderLine() {
      var canvas = document.getElementById('powerOutputLine');
      var data = {
        labels: [],
        datasets: [{
          label: 'Power Output in kVA',
          fill: true,
          fillColor: '#fff',
          bodyFontColor: '#fff',
          lineTension: 0.3,
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
          data: []
        }]
      };

      function adddata() {
        myLineChart.data.datasets[0].data.push(Math.floor(Math.random() * 10) + 35);
        myLineChart.data.labels.push(moment(new Date()).format('DD/M/YYYY h:mm:ss a'));
        myLineChart.update();
      }

      var option = {
        showLines: true,
        legend: { labels: { fontColor: 'white' } },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }]
        }
      };
      var myLineChart = _chart.Chart.Line(canvas, {
        data: data,
        options: option
      });

      setInterval(function () {
        adddata();
      }, 10000);
    };

    AssetDetails.prototype.renderEvents = function renderEvents() {
      var me = this;

      var config = $.extend(true, {
        height: 700,
        columns: [{
          field: 'eventType',
          title: 'Event Type',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'eventTime',
          title: 'Event Time',
          template: "#: App.util.format.dateTime(data.eventTime, App.currentUser.dateTimeFormat)|| '-' #",
          filterable: {
            extra: 'true',
            messages: {
              info: 'Show items between dates:'
            }
          }
        }, {
          field: 'createdTime',
          title: 'Created Time',
          template: "#: App.util.format.dateTime(data.createdTime, App.currentUser.dateTimeFormat)|| '-' #",
          filterable: {
            extra: 'true',
            messages: {
              info: 'Show items between dates:'
            }
          }
        }, {
          field: 'latitude',
          title: 'Latitude'

        }, {
          field: 'longitude',
          title: 'Longitude'

        }, {
          field: 'payload',
          title: 'Payload',
          width: 100,
          hidden: true
        }, {
          field: 'engineHourMeter',
          title: 'Engine Hour Meter'

        }, {
          field: 'powerOutputKW',
          title: 'Power Output In KW'

        }, {
          field: 'engineCoolantTemperature',
          title: 'Engine Coolant Temperature',
          template: "#: App.util.format.item(data.engineCoolantTemperature,\"temperature\", true)|| '-' #"

        }, {
          field: 'engineFrequency',
          title: 'Engine Frequency'

        }, {
          field: 'averageLineToLineVoltage',
          title: 'Average Line To Line Voltage'

        }, {
          field: 'averageLineToNeutralVoltage',
          title: 'Average Line To Neutral Voltage'

        }, {
          field: 'averageAcRmsCurrent',
          title: 'Average Ac Rms Current'

        }, {
          field: 'phaseBCurrent',
          title: 'Phase B Current'

        }, {
          field: 'phaseCCurrent',
          title: 'Phase C Current'

        }, {
          field: 'oilPressure',
          title: 'Oil Pressure',
          template: "# App.util.format.item(data.oilPressure,\"pressure\", true)|| '-' #"

        }, {
          field: 'averageFuelConsumptionnRate',
          title: 'Fuel Consumption Rate'

        }, {
          field: 'fuelUsed',
          title: 'fuel Used',
          template: "# App.util.format.item(data.fuelUsed,\"volume\", true)|| '-' #"

        }, {
          field: 'currentFuelLevel',

          title: 'Fuel Level',

          template: "#: App.util.format.item(data.currentFuelLevel,\"volume\") || '-' #"

        }]
      }, App.config.grid);

      config.dataSource.transport.read.url = App.config.apiUrl + '/sensormessageevent';

      config.dataSource.filter = [{
        field: '_asset',
        operator: 'eq',
        value: me.model._id
      }];

      this.grid = $('#eventGrid').kendoGrid(config);
    };

    AssetDetails.prototype.renderAssetAlarms = function renderAssetAlarms() {
      var me = this;

      var config = $.extend(true, {
        columns: [{ field: '_asset.name', title: 'Asset' }, { field: 'name', title: 'Alarm' }, {
          field: 'triggerDate',
          title: 'Trigger Date',
          template: '#:App.util.format.dateTime(data.triggerTime, App.currentUser.dateTimeFormat) #'
        }, {
          command: { text: 'Reset', click: me.acknowledgeAlarm },
          title: 'Command',
          width: '100px'
        }]
      }, App.config.grid);

      config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';

      config.dataSource.filter = [{
        field: '_asset',
        operator: 'eq',
        value: me.model._id
      }, {
        field: 'triggered',
        operator: 'eq',
        value: true
      }];

      this.grid = $(this.assetAlarms).kendoGrid(config);
    };

    AssetDetails.prototype.acknowledgeAlarm = function acknowledgeAlarm(e) {
      e.preventDefault();

      var dataItem = this.dataItem($(e.currentTarget).closest('tr'));

      kendo.prompt('Please, enter a comment', '').then(function (data) {
        $.ajax({
          method: 'PUT',
          url: App.config.apiUrl + '/alarm/reset',
          data: { _id: dataItem._id, msg: data, alarm: dataItem.toJSON() },
          success: function success(res) {
            kendo.alert('Acknowledgement sucessful');

            App.currentView.renderAssetAlarms();
          },
          error: function error(err) {
            me.renderAssetAlarms();
          }
        });
      }, function () {
        kendo.alert('Acknowledgement cancelled');
      });
    };

    AssetDetails.prototype.toggleStats = function toggleStats(str) {
      this.stats.controls[str] = !this.stats.controls[str];
      this.stats[str] = this.stats.data[str][this.stats.controls[str]];
    };

    AssetDetails.prototype.renderFuelLevelGauge = function renderFuelLevelGauge() {
      $('#gauge').kendoRadialGauge({
        theme: 'material',
        pointer: {
          value: App.util.format.item(64, 'volume')
        },
        scale: {
          minorUnit: 5,
          startAngle: -30,
          endAngle: 210,
          labels: {
            template: "#= App.util.format.item(value,'volume') #%"
          },
          max: 100,
          ranges: [{
            from: 0,
            to: 20,
            color: '#ff3d00'
          }, {
            from: 20,
            to: 50,
            color: '#ffff00'
          }, {
            from: 50,
            to: 100,
            color: '#00c853'
          }]
        }
      });
    };

    AssetDetails.prototype.remotePingCommand = function remotePingCommand() {
      this.commands.ping.timestamp = moment(Date()).format('DD/M/YYYY h:mm:ss a');
    };

    AssetDetails.prototype.setCommandStatuses = function setCommandStatuses() {
      if (this.commands.remoteStartStop.status === 'ON') {
        $(this.remoteStart).addClass('disabled');
      } else {
        $(this.remoteStop).addClass('disabled');
      }
    };

    AssetDetails.prototype.sendRemoteCommand = function sendRemoteCommand(cmd) {
      var me = this;
      if (me.model) {
        this.http.client.post('/asset/command', {
          imei: me.model.sensor,
          command: cmd,
          interfaceType: me.model.interfaceType
        }).then(function (res) {
          if (res) {
            console.log(res);
            Materialize.toast(res.message, 5000);
          }
        });
      }
    };

    return AssetDetails;
  }()) || _class);
});
define('asset-list/asset-list',['exports', 'aurelia-framework', '../http', 'chart.js', 'aurelia-router'], function (exports, _aureliaFramework, _http, _chart, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssetList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AssetList = exports.AssetList = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaRouter.Router), _dec(_class = function () {
    function AssetList(http, router) {
      _classCallCheck(this, AssetList);

      this.project = {};
      this.cards = {};

      this.http = http;
      this.router = router;
      this.user = App.currentUser;
    }

    AssetList.prototype.attached = function attached() {
      var _this = this;

      var me = this;

      this.tagger = new Taggle('list-tags', {
        allowDuplicates: false,

        onTagAdd: function onTagAdd(event, tag) {
          if (me.tagger) {
            me.renderGrid(me.tagger.getTags().values);
          }
        },

        onTagRemove: function onTagRemove(event, tag) {
          me.renderGrid(me.tagger.getTags().values);
        }
      });

      if (this.router.currentInstruction.params && this.router.currentInstruction.params.id) {
        var id = this.router.currentInstruction.params.id;
        this.getProject(id, function () {
          _this.loading = false;
          _this.deferred();
        });
      } else {
        this.deferred();
      }
    };

    AssetList.prototype.deferred = function deferred() {
      var me = this;

      me.renderGrid();

      me.renderEngineRatingChart();

      me.renderCapacityChart();
    };

    AssetList.prototype.getProject = function getProject(id, callback) {
      var _this2 = this;

      this.http.client.get('/project/id/' + id).then(function (res) {
        if (res && res.data) {
          _this2.project = res.data[0];
          callback();
        }
      });
    };

    AssetList.prototype.renderGrid = function renderGrid(tags) {
      var config = $.extend(true, {
        detailTemplate: kendo.template($('#template').html()),
        columns: [{
          template: "<a href='\\#asset-details/#:_id#'>#:name#</a>",
          field: 'name',
          title: 'Asset Name',
          width: 150,
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'model',
          title: 'Model Name',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'manufacturer',
          title: 'Manufacturer',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'controlPanelManufacturer',
          title: 'Control Panel Manufacturer',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'updated_at',
          title: 'Modified Time',
          template: '#: App.util.format.dateTime(data.updated_at, App.currentUser.dateTimeFormat) #',
          filterable: {
            extra: 'true',
            messages: {
              info: 'Show items between dates:'
            }
          }
        }]
      }, App.config.grid);

      if (App.currentUser.privileges.indexOf(1) > -1) {
        config.toolbar.push({
          template: '<a class="k-button" href="\\#/asset-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
        });
      }

      if (tags) {
        config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/asset';

      if (this.project._id && this.project.assets) {
        config.dataSource.filter = $.extend(config.dataSource.filter, {
          field: 'ids',
          operator: 'eq',
          value: this.project.assets.join(',')
        });
      }

      this.grid = $('#assetGrid').kendoGrid(config);
    };

    AssetList.prototype.renderEngineRatingChart = function renderEngineRatingChart() {
      var me = this;
      var url = this.project._id ? '/statistics/generatorenginerating/' + this.project._id : '/statistics/generatorenginerating/';

      this.loadingEngineRatingChart = true;
      this.http.client.get(url).then(function (res) {
        me.noEngineRatingChart = false;

        me.loadingEngineRatingChart = false;
        if (res && res.data.length && res.data[0].generatorEngineRating) {
          var engineRating = res.data[0].generatorEngineRating;
          me.cards.engineRatingChart = new _chart.Chart(me.engineRatingChart, {
            type: 'pie',
            data: {
              labels: ['Prime', 'Continous', 'Stand-by'],
              datasets: [{
                data: [engineRating.prime, engineRating.continuous, engineRating.standby],
                backgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa'],
                hoverBackgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa']
              }]
            }
          });
        } else {
          me.noEngineRatingChart = true;
        }
      });
    };

    AssetList.prototype.renderCapacityChart = function renderCapacityChart() {
      var _this3 = this;

      var me = this;
      var url = this.project._id ? '/statistics/generatorcapacity/' + this.project._id : '/statistics/generatorcapacity/';

      this.loadingCapacityChart = true;
      this.http.client.get(url).then(function (res) {
        me.loadingCapacityChart = false;
        if (res && res.data.length && res.data[0].generatorCapacity) {
          me.noCapacityChart = false;
          var data = [];
          var categories = [];
          var generatorCapacity = res.data[0].generatorCapacity;
          for (var rating in generatorCapacity) {
            data.push(generatorCapacity[rating]);
            categories.push(rating);
          }

          $(_this3.capacityChart).kendoChart({
            title: {
              text: 'Genset Capacity Statistics'
            },
            theme: 'material',
            legend: {
              position: 'top'
            },
            seriesDefaults: {
              type: 'column'
            },
            seriesColors: ['#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'],
            series: [{
              name: 'Generators',
              data: data
            }],
            valueAxis: {
              labels: {
                format: '{0}'
              },
              line: {
                visible: true
              },
              axisCrossingValue: 0
            },
            categoryAxis: {
              categories: categories,
              line: {
                visible: false
              }

            },
            tooltip: {
              visible: true,
              format: '{0} kVA',
              template: '#= series.name #: #= value #'
            }
          });
        } else {
          me.noCapacityChart = true;
        }
      });
    };

    return AssetList;
  }()) || _class);
});
define('commands/commands',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Commands = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Commands = exports.Commands = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function Commands(http) {
      _classCallCheck(this, Commands);

      this.imeis = [];
      this.interfaceMap = [];
      this.btnText = 'Send Command';
      this.btnDisable = false;

      this.http = http;
    }

    Commands.prototype.attached = function attached() {
      var me = this;
      App.currentView = this;

      $('#command-multiselect').kendoMultiSelect({
        autoBind: true,
        dataTextField: 'name',
        dataValueField: 'name',
        filter: 'contains',
        suggest: true,
        index: 3,
        select: function select(data) {
          me.imeis.push(data.dataItem.sensor);
          me.interfaceMap.push(data.dataItem.interfaceType);
        },
        deselect: function deselect(data) {
          console.log('deselect');
          var index = me.imeis.indexOf(data.dataItem.sensor);
          if (index > -1) {
            me.imeis.splice(index, 1);
            me.interfaceMap.splice(index, 1);
          }
        },
        dataSource: {
          type: 'odata',
          serverFiltering: false,
          transport: {
            read: {
              url: App.config.apiUrl + '/asset',
              type: 'GET',
              contentType: 'application/json',
              accept: 'application/json, text/plain, */*',
              dataType: 'json',
              xhrFields: { withCredentials: true }
            }
          },
          schema: {
            data: 'data.docs',
            total: 'data.total',
            model: {
              fields: {
                eventTime: { type: 'date' },
                createdTime: { type: 'date' },
                updated_at: { type: 'date' },
                created_at: { type: 'date' }
              }
            }
          }
        }
      });
    };

    Commands.prototype.sendCommand = function sendCommand() {
      var _this = this;

      this.btnText = 'Sending';
      this.btnDisable = true;

      this.http.client.post('/asset/rawcommand', {
        imeis: this.imeis,
        interfaceMap: this.interfaceMap,
        command: this.rawCommand
      }).then(function (res) {
        _this.btnText = 'Send Command';
        _this.btnDisable = false;
        if (res && res.message) {
          Materialize.toast(res.message, 3000);
        }
      });
    };

    return Commands;
  }()) || _class);
});
define('geofences/geofences',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _http, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Geofences = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Geofences = exports.Geofences = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function Geofences(http, httpClient) {
      _classCallCheck(this, Geofences);

      this.http = http;
      this.fetchAPI = httpClient;
    }

    Geofences.prototype.attached = function attached() {
      App.currentView = this;

      this.renderGeofences();
    };

    Geofences.prototype.renderGeofences = function renderGeofences() {
      var me = this;

      var config = $.extend(true, {
        columns: [{
          field: 'name',
          title: 'Geofence'
        }, {
          field: 'type',
          title: 'Geofence Type'
        }]
      }, App.config.grid);

      config.dataBound = function () {};

      if (App.currentUser.privileges.indexOf(4) > -1) {
        config.columns.push({
          command: { text: 'Delete', click: me.deleteGeofence },
          title: 'Command',
          width: '100px'
        });
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/geofence';

      this.grid = $('#geofences').kendoGrid(config);
    };

    Geofences.prototype.deleteGeofence = function deleteGeofence(e) {
      e.preventDefault();

      var dataItem = this.dataItem($(e.currentTarget).closest('tr'));

      kendo.confirm('Are you sure you want to delete?').then(function (data) {
        $.ajax({
          method: 'DELETE',
          url: App.config.apiUrl + '/geofence/',
          data: { _id: dataItem._id },
          success: function success(res) {
            kendo.alert('Deletion sucessful');

            App.currentView.renderGeofences();
          },
          error: function error(err) {
            me.renderGeofences();
          }
        });
      }, function () {
        kendo.alert('Deletion cancelled');
      });
    };

    Geofences.prototype.massUpload = function massUpload(files) {
      console.log('upload file');
      if (files && files[0]) {
        var file = files[0];
        var filename = void 0;

        if (file.name.match('.csv')) {
          filename = App.currentUser._id + '_' + Date.now() + '.csv';
        } else if (file.name.match('.json')) {
          filename = App.currentUser._id + '_' + Date.now() + '.json';
        } else {
          Materialize.toast('Please upload a .csv or .json file', 3000);
        }
        if (filename) {
          var formData = new FormData();
          formData.append('files', file, filename);


          this.fetchAPI.fetch(App.config.apiUrl + '/geofence/upload', {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (data) {
              Materialize.toast('File uploaded successfully', 3000);
            }
          }).catch(function (error) {
            return Materialize.toast(error.message, 5000);
          });
        }
      } else {
        Materialize.toast('Please upload a file.', 2000);
      }
    };

    return Geofences;
  }()) || _class);
});
define('locations/locations',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _http, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Alarms = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Alarms = exports.Alarms = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function Alarms(http, httpClient) {
      _classCallCheck(this, Alarms);

      this.http = http;
      this.fetchAPI = httpClient;
    }

    Alarms.prototype.attached = function attached() {
      App.currentView = this;

      this.renderLocations();
    };

    Alarms.prototype.renderLocations = function renderLocations() {
      var me = this;

      var config = $.extend(true, {
        columns: [{
          field: 'name',
          title: 'POI'
        }, {
          field: 'type',
          title: 'POI Type'
        }, {
          field: 'latitude',
          title: 'Latitude'
        }, {
          field: 'longitude',
          title: 'Longitude'
        }]
      }, App.config.grid);

      config.dataBound = function () {};

      if (App.currentUser.privileges.indexOf(3) > -1) {
        config.columns.push({
          command: { text: 'Delete', click: me.deleteLocation },
          title: 'Command',
          width: '100px'
        });
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/location';

      this.grid = $('#locations').kendoGrid(config);
    };

    Alarms.prototype.deleteLocation = function deleteLocation(e) {

      var dataItem = this.dataItem($(e.currentTarget).closest('tr'));

      kendo.confirm('Are you sure you want to delete?').then(function (data) {
        var me = this;
        $.ajax({
          method: 'DELETE',
          url: App.config.apiUrl + '/location/',
          data: { _id: dataItem._id },
          success: function success(res) {
            kendo.alert('Deletion sucessful');

            App.currentView.renderLocations();
          },
          error: function error(err) {
            me.renderLocations();
            me.close();
          }
        });
      }, function () {
        kendo.alert('Deletion cancelled');
        me.close();
      });
    };

    Alarms.prototype.massUpload = function massUpload(files) {
      console.log('upload file');
      if (files && files[0]) {
        var file = files[0];
        var filename = void 0;

        if (file.name.match('.csv')) {
          filename = App.currentUser._id + '_' + Date.now() + '.csv';
        } else if (file.name.match('.json')) {
          filename = App.currentUser._id + '_' + Date.now() + '.json';
        } else {
          Materialize.toast('Please upload a .csv or .json file', 3000);
        }
        if (filename) {
          var formData = new FormData();
          formData.append('files', file, filename);


          this.fetchAPI.fetch(App.config.apiUrl + '/location/upload', {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (data) {
              Materialize.toast('File uploaded successfully', 3000);
            }
          }).catch(function (error) {
            return Materialize.toast(error.message, 5000);
          });
        }
      } else {
        Materialize.toast('Please upload a file.', 2000);
      }
    };

    return Alarms;
  }()) || _class);
});
define('login/forgot-password',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ForgotPassword = exports.ForgotPassword = function ForgotPassword() {
        _classCallCheck(this, ForgotPassword);
    };
});
define('login/login',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Login = exports.Login = function () {
        function Login() {
            _classCallCheck(this, Login);
        }

        Login.prototype.configureRouter = function configureRouter(config, router) {
            config.map([{
                route: '', name: 'user-password',
                moduleId: './user-password',
                title: 'Sign In'
            }, {
                route: 'forgot-password',
                name: 'forgot-password',
                moduleId: './forgot-password',
                title: 'Forgot Password?'
            }]);
            config.mapUnknownRoutes(function (instruction) {
                return './user-password';
            });

            this.router = router;
        };

        Login.prototype.attached = function attached() {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                        "image": {
                            "src": "img/github.svg",
                            "width": 100,
                            "height": 100
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 5,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 6,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 400,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true,
                "config_demo": {
                    "hide_card": false,
                    "background_color": "#0000",
                    "background_image": "",
                    "background_position": "50% 50%",
                    "background_repeat": "no-repeat",
                    "background_size": "cover"
                }
            });
        };

        return Login;
    }();
});
define('login/user-password',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UserPassword = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var UserPassword = exports.UserPassword = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _http.Http), _dec(_class = function () {
    function UserPassword(aurelia, http) {
      _classCallCheck(this, UserPassword);

      this.loading = false;
      this.loginBtnText = 'Login';
      this.model = {
        loginName: '',
        password: ''
      };

      this.aurelia = aurelia;
      this.client = http.client;
    }

    UserPassword.prototype.login = function login() {
      var _this = this;

      var me = this;
      this.loading = true;
      this.loginBtnText = 'Logging in...';

      this.client.post('/user/logon', this.model).then(function (res) {
        me.loading = false;
        if (res) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          _this.aurelia.setRoot('app');
        }
      });
    };

    return UserPassword;
  }()) || _class);
});
define('map/map',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Map = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Map = exports.Map = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function Map(http) {
      _classCallCheck(this, Map);

      this.loading = true;
      this.locationCreation = false;
      this.mapControl = {
        refreshInterval: 20000,
        autoRefresh: true,
        autoPan: true,
        autoZoom: false,
        autoCluster: true
      };
      this.markers = [];
      this.dropMarker = null;
      this.markerSelected = [];
      this.locationMarkers = [];
      this.geofenceMarkers = [];
      this.newLocation = {};

      this.client = http.client;
    }

    Map.prototype.attached = function attached() {
      var _this = this;

      App.currentView = this;
      var me = this;

      this.loading = false;
      $('ul.tabs').tabs();

      $('.collapsible').collapsible();

      $(this.locationTypes).kendoDropDownList({
        dataSource: App.config.locationTypes,

        change: function change() {
          me.newLocation.type = this.value();
        }
      });

      $(this.geofenceTypes).kendoDropDownList({
        dataSource: App.config.geofenceTypes,

        change: function change() {
          me.newGeofence.type = this.value();
        }
      });

      $(this.geofenceLocation).kendoMultiSelect({
        placeholder: 'Search...',
        dataTextField: 'name',
        dataValueField: '_id',
        maxSelectedItems: 1,
        ignoreCase: false,
        filter: 'contains',

        dataSource: {
          type: 'odata',
          serverFiltering: true,
          transport: {
            read: {
              type: 'GET',
              contentType: 'application/json',
              accept: 'application/json, text/plain, */*',
              dataType: 'json',
              xhrFields: { withCredentials: true },
              url: App.config.apiUrl + '/misc/find/location'
            }
          }
        },
        select: function select(e) {
          if (e.dataItem._id) {
            me.newGeofence._location = e.dataItem._id;
          }
        },
        deselect: function deselect(e) {
          me.newGeofence._location = null;
        }

      });

      this.initMap(function () {
        setTimeout(function () {
          google.maps.event.trigger(me.googleMap, 'resize');
        }, 200);

        _this.renderAssetMarkers(function () {
          $('ul.tabs').tabs();

          _this.initMarkerSelect();

          _this.renderLocationsTree();

          _this.renderGeofencesTree();
        });
      });
    };

    Map.prototype.initMap = function initMap(callback) {
      console.log('initMap');
      var me = this;

      this.latlngBounds = new google.maps.LatLngBounds();

      App.googleMap = this.googleMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 25, lng: 55 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        scrollwheel: true,
        draggable: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: false,
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
        }
      });

      this.renderLegend(this.googleMap);

      callback();
    };

    Map.prototype.renderLegend = function renderLegend(map) {
      var legend = this.legend;
      legend.innerHTML = '\n        <div class=\'card map-legend\'>\n          <h7>Legend</h7>\n          <ul>\n            <li><img src="/images/map/icons/on-sm.png"> ON</li>\n            <li><img src="/images/map/icons/off-sm.png"> OFF</li>\n            <li><img src="/images/map/icons/alert-sm.png"> Alarmed</li>\n            <li><img src="/images/map/icons/maintenance-sm.png"> Maintenance</li>\n            <li><img src="/images/map/icons/unknown-sm.png"> Unknown</li>\n            <li><img src="/images/map/icons/decommissioned-sm.png"> Decommissioned</li>\n          </ul>\n        </div>\n        ';
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    };

    Map.prototype.initMarkerSelect = function initMarkerSelect() {
      var dataSource = [];
      for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        dataSource.push({
          id: marker.id
        });
      }

      this.markerSelect = $('#markerSelect').kendoMultiSelect({
        autoClose: false,
        dataSource: dataSource,
        dataTextField: 'id',
        dataValueField: 'id'
      }).data('kendoMultiSelect');
    };

    Map.prototype.renderAssetMarkers = function renderAssetMarkers(callback) {
      var me = this;
      if (this.markerCluster) {
        this.removeCluster();
        this.markerClusterer.clearMarkers();
      }

      this.removeMarkers();
      this.markers = [];

      this.client.get('/map/assets').then(function (res) {
        if (res && res.data) {
          console.info('map');

          var _loop = function _loop(i) {
            var markerInfo = res.data[i];
            var infowindow = new google.maps.InfoWindow({
              content: '\n                               <div id="tabstrip">\n                            <ul>\n                                <li class="k-state-active">\n                                    Event Info\n                                </li>\n                                <li>\n                                    Asset Info\n                                </li>\n                            </ul>\n                            <div>\n                               <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Name</b></td>\n                                              <td><a href=\'#asset-details/' + markerInfo._asset._id + '\'>' + markerInfo._asset.name + '</a></td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Status</b></td>\n                                            <td>' + (markerInfo._asset.status || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Type</b></td>\n                                            <td>' + markerInfo.eventType + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Time</b></td>\n                                            <td>' + App.util.format.dateTime(markerInfo.eventTime, App.currentUser.dateTimeFormat) + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Position</b></td>\n                                            <td>' + markerInfo.latitude + ', ' + markerInfo.longitude + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                            <div>\n                                <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Engine Status</b></td>\n                                            <td>' + (markerInfo.engineStatus || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Engine Hour Meter</b></td>\n                                            <td>' + (markerInfo.engineHourMeter || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Supply Voltage</b></td>\n                                            <td>' + (markerInfo.powerSupplyVoltage || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Coolant Temperature</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.engineCoolantTemperature, 'temperature') || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Oil Pressure</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.oilPressure, 'pressure') || '-') + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                        </div>\n                                    '
            });

            var iconUrl = '/images/map/icons/unknown.png';
            if (markerInfo._asset.status && markerInfo._asset.status !== 'Deployed') {
              switch (markerInfo._asset.status) {
                case 'Maintenance':
                  iconUrl = '/images/map/icons/maintenance.png';
                  break;

                case 'Decommissioned':
                  iconUrl = '/images/map/icons/decommissioned.png';
                  break;

                default:
                  break;
              }
            } else {
              if (markerInfo._asset && markerInfo._asset.features.engineStatus) {
                switch (markerInfo._asset.features.engineStatus.value) {
                  case 'on':
                    iconUrl = '/images/map/icons/on.png';
                    break;

                  case 'off':
                    iconUrl = '/images/map/icons/off.png';
                    break;

                  default:
                    break;
                }
              }
            }

            var marker = new google.maps.Marker({
              position: {
                lat: parseFloat(markerInfo.latitude),
                lng: parseFloat(markerInfo.longitude)
              },
              title: markerInfo.assetName,
              icon: iconUrl,
              map: me.googleMap,
              id: markerInfo._asset.name
            });

            marker.addListener('click', function () {
              infowindow.open(me.googleMap, marker);
            });

            google.maps.event.addListener(infowindow, 'domready', function (e) {
              $('#tabstrip').kendoTabStrip({
                animation: {
                  open: {
                    effects: 'fadeIn'
                  }
                }
              });

              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();

              iwBackground.children(':nth-child(2)').css({ display: 'none' });

              iwBackground.children(':nth-child(4)').css({ display: 'none' });
            });

            me.markers.push(marker);

            me.latlngBounds.extend({
              lat: parseFloat(markerInfo.latitude),
              lng: parseFloat(markerInfo.longitude)
            });
          };

          for (var i = 0; i < res.data.length; i++) {
            _loop(i);
          }

          if (me.mapControl.autoPan) {
            me.autoPan();
          }

          if (me.mapControl.autoCluster) {
            me.addClusters();
          }

          callback && callback();
        }
      });
    };

    Map.prototype.removeMarkers = function removeMarkers() {
      var markers = this.markers;

      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };

    Map.prototype.createDropMarker = function createDropMarker(latlng, name, html) {
      var marker = new google.maps.Marker({
        position: latlng,
        icon: '/images/map/icons/dropmarker.png',
        map: this.googleMap,
        zIndex: Math.round(latlng.lat() * -100000) << 5
      });

      return marker;
    };

    Map.prototype.startRefresher = function startRefresher() {
      var _this2 = this;

      console.info('map refresher started');
      this.refresher = setInterval(function () {
        _this2.getAssetMarkers(null);
      }, this.mapControl.refreshInterval);
    };

    Map.prototype.stopRefresher = function stopRefresher() {
      console.info('map refresher stopped');
      clearInterval(this.refresher);
    };

    Map.prototype.toggleRefresher = function toggleRefresher(e) {
      if (e.srcElement.checked) {
        this.startRefresher();
      } else {
        this.stopRefresher();
      }
    };

    Map.prototype.autoPan = function autoPan() {
      var len = this.markers.length;
      for (var i = 0; i < len; i++) {
        this.markers[i].map && this.latlngBounds.extend(this.markers[i].position);
      }

      this.googleMap.fitBounds(this.latlngBounds);
    };

    Map.prototype.addClusters = function addClusters() {
      this.markerClusterer = new MarkerClusterer(this.googleMap, this.markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    };

    Map.prototype.removeCluster = function removeCluster() {
      this.markerClusterer.clearMarkers();
      this.renderAssetMarkers(function () {});
    };

    Map.prototype.toggleClusterer = function toggleClusterer(e) {
      if (e.srcElement.checked) {
        this.addClusters();
      } else {
        this.removeCluster();
      }
    };

    Map.prototype.filterMarkers = function filterMarkers() {
      this.removeMarkers();
      this.markerClusterer.clearMarkers();
      var selectedValues = this.markerSelect.value();

      if (selectedValues && selectedValues.length > 0) {
        var selectedLen = selectedValues.length;
        var markersLen = this.markers.length;

        this.markerSelected = [];

        for (var i = 0; i < selectedLen; i++) {
          for (var j = 0; j < markersLen; j++) {
            if (selectedValues[i] === this.markers[j].id) {
              this.markerSelected.push(this.markers[j]);

              if (!this.markers[j].getMap()) {
                this.markers[j].setMap(this.googleMap);
              }
            }
          }
        }
        this.autoPan();
        this.mapControl.autoRefresh = false;
      } else {
        this.renderAssetMarkers();
      }
    };

    Map.prototype.selectGeofence = function selectGeofence() {
      var geofencesToShow = [];
      var grid = $('#geofence-tree').data('kendoGrid');
      var ds = grid.dataSource.view();

      for (var i = 0; i < ds.length; i++) {
        for (var j = 0; j < ds[i].items.length; j++) {
          var row = grid.table.find("tr[data-uid='" + ds[i].items[j].uid + "']");
          var checkbox = $(row).find('.geofence-node');
          if (checkbox.is(':checked')) {
            geofencesToShow.push(ds[i].items[j]);
          }
        }
      }

      if (geofencesToShow.length) {
        this.showGeofences(geofencesToShow);
      } else {
        this.removeGeofences();
      }
    };

    Map.prototype.showGeofences = function showGeofences(geofences) {
      console.log('geofences: ', geofences);
      var me = this;

      this.removeGeofences();

      for (var i = 0; i < geofences.length; i++) {
        this.renderGeofence(geofences[i]);
      }

      if (me.mapControl.autoPan) {
        me.autoPan();
      }
    };

    Map.prototype.renderGeofence = function renderGeofence(geofence) {
      var me = this;
      var geofenceMarker = void 0;

      var strokeColor = '#FF0000';
      var fillColor = '#FF0000';

      if (geofence.type === 'inclusive') {
        strokeColor = '#78F576';
        fillColor = '#78F576';
      }

      switch (geofence.geoShape.type) {
        case 'circle':
          geofenceMarker = new google.maps.Circle({
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.35,
            map: me.googleMap,
            center: geofence.geoShape.center,
            radius: geofence.geoShape.radius
          });
          break;
        case 'polygon':
          geofenceMarker = new google.maps.Polygon({
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.35,
            map: me.googleMap,
            paths: geofence.geoShape.path.toJSON()
          });
          break;
        case 'rectangle':
          geofenceMarker = new google.maps.Polygon({
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.35,
            map: me.googleMap,
            bounds: geofence.geoShape.bounds
          });
          break;
        default:
          break;
      }
      this.geofenceMarkers.push(geofenceMarker);
    };

    Map.prototype.removeGeofences = function removeGeofences() {
      var geofences = this.geofenceMarkers;

      for (var i = 0; i < geofences.length; i++) {
        geofences[i].setMap(null);
      }
    };

    Map.prototype.renderLocationsTree = function renderLocationsTree() {
      var config = $.extend(true, {
        columns: [{
          field: 'name',
          title: 'Location',
          template: '<img src="/images/map/locations/#= type #.png" width="16" height="16"> #= name #'
        }, {
          template: '<p> <input type="checkbox"  class="filled-in location-node" id="#:_id#" /><label for="#:_id#"></label></p>'
        }, {
          field: 'type',
          title: 'Type',
          groupHeaderTemplate: '#= value # (#= count#)',
          hidden: true
        }]
      }, App.config.grid);

      config.toolbar = null;
      config.sortable = false;
      config.scrollable = false;
      config.pageable = false;
      config.groupable = false;

      config.height = 'auto';

      config.dataSource.pageSize = 1000;

      config.dataSource.group = {
        field: 'type',
        dir: 'asc',
        aggregates: [{ field: 'type', aggregate: 'count' }]
      };

      config.dataSource.transport.read.url = App.config.apiUrl + '/location';

      this.grid = $('#location-tree').kendoGrid(config);
    };

    Map.prototype.selectLocation = function selectLocation() {
      var locationsToShow = [];
      var grid = $('#location-tree').data('kendoGrid');
      var ds = grid.dataSource.view();

      for (var i = 0; i < ds.length; i++) {
        for (var j = 0; j < ds[i].items.length; j++) {
          var row = grid.table.find("tr[data-uid='" + ds[i].items[j].uid + "']");
          var checkbox = $(row).find('.location-node');
          if (checkbox.is(':checked')) {
            locationsToShow.push(ds[i].items[j]);
          }
        }
      }

      if (locationsToShow.length) {
        this.showLocations(locationsToShow);
      } else {
        this.removeLocations();
      }
    };

    Map.prototype.showLocations = function showLocations(locations) {
      var me = this;

      this.removeLocations();

      var _loop2 = function _loop2(i) {
        var markerInfo = locations[i];

        var marker = new google.maps.Marker({
          position: {
            lat: parseFloat(markerInfo.latitude),
            lng: parseFloat(markerInfo.longitude)
          },
          title: markerInfo.name,
          icon: '/images/map/locations/' + markerInfo.type + '.png',
          map: me.googleMap,
          id: markerInfo._id
        });

        var infowindow = new google.maps.InfoWindow({
          content: '\n                               <div id="tabstrip">\n                            <ul>\n                                <li class="k-state-active">\n                                    Location Info\n                                </li>\n                            </ul>\n                            <div>\n                               <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Name</b></td>\n                                            <td>' + markerInfo.name + i + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Type</b></td>\n                                            <td>' + markerInfo.type + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Position</b></td>\n                                            <td>' + markerInfo.latitude + ', ' + markerInfo.longitude + '</td>\n                                            </tr>>\n                                        </tbody>\n                                    </table>\n                            </div>\n                        </div>\n                                    '
        });

        marker.addListener('click', function () {
          infowindow.open(me.googleMap, marker);
        });

        google.maps.event.addListener(infowindow, 'domready', function (e) {
          $('#tabstrip').kendoTabStrip({
            animation: {
              open: {
                effects: 'fadeIn'
              }
            }
          });
        });

        me.locationMarkers.push(marker);

        me.latlngBounds.extend({
          lat: parseFloat(markerInfo.latitude),
          lng: parseFloat(markerInfo.longitude)
        });
      };

      for (var i = 0; i < locations.length; i++) {
        _loop2(i);
      }

      if (me.mapControl.autoPan) {
        me.autoPan();
      }
    };

    Map.prototype.removeLocations = function removeLocations() {
      var locations = this.locationMarkers;

      for (var i = 0; i < locations.length; i++) {
        locations[i].setMap(null);
      }
    };

    Map.prototype.showAllLocations = function showAllLocations() {};

    Map.prototype.showLocationCreationModel = function showLocationCreationModel() {
      var me = this;
      this.locationCreation = true;

      this.newLocation = {};

      this.dropMarkerListener = google.maps.event.addListener(this.googleMap, 'click', function (event) {
        $('ul.tabs').tabs();

        if (me.dropMarker) {
          me.dropMarker.setMap(null);
          me.dropMarker = null;
        }

        me.newLocation.latitude = event.latLng.lat().toPrecision(6);
        me.newLocation.longitude = event.latLng.lng().toPrecision(6);

        me.dropMarker = me.createDropMarker(event.latLng, 'name', '\n           <button id="primaryTextButton" class="k-primary">Create a location</button>\n        ');
      });
    };

    Map.prototype.hideLocationCreationModel = function hideLocationCreationModel() {
      this.locationCreation = false;

      this.dropMarker.setMap(null);

      google.maps.event.removeListener(this.dropMarkerListener);
    };

    Map.prototype.createLocation = function createLocation() {
      var _this3 = this;

      var me = this;
      console.log('createLocation');
      if (!this.newLocation.type) {
        this.newLocation.type = App.config.locationTypes[0];
      }
      if (this.newLocation.name && this.newLocation.latitude && this.newLocation.longitude) {
        this.client.post('/location', {
          name: me.newLocation.name,
          type: me.newLocation.type,
          latitude: me.newLocation.latitude,
          longitude: me.newLocation.longitude
        }).then(function (res) {
          if (res) {
            _this3.renderLocationsTree();
            _this3.hideLocationCreationModel();
          }
        });
      } else {
        Materialize.toast('Please fill in all the necessary fields', 3000);
      }
    };

    Map.prototype.showGeofenceCreationModel = function showGeofenceCreationModel() {
      this.geofenceCreation = true;
      this.newGeofence = {};

      this.showGeofenceCreationOverlay();
    };

    Map.prototype.hideGeofenceCreationModel = function hideGeofenceCreationModel() {
      this.geofenceCreation = false;

      this.deleteAllShape();

      this.hideGeofenceCreationOverlay();
    };

    Map.prototype.createGeofence = function createGeofence() {
      var _this4 = this;

      var me = this;

      if (!this.newGeofence.type) {
        this.newGeofence.type = App.config.geofenceTypes[0];
      }
      if (this.newGeofence._location && this.newGeofence.name && this.newGeofence.geoShape) {
        console.log(this.newGeofence);
        this.client.post('/geofence', me.newGeofence).then(function (res) {
          if (res) {
            _this4.renderGeofencesTree();
            _this4.hideGeofenceCreationModel();
          }
        });
      } else {
        Materialize.toast('Please fill in all the necessary fields', 3000);
      }
    };

    Map.prototype.renderGeofencesTree = function renderGeofencesTree() {
      var config = $.extend(true, {
        columns: [{
          field: 'name',
          title: 'Geofence',
          template: '<img src="/images/map/geofences/#= data.type #.png" width="16" height="16"> #= data.name #'
        }, {
          template: '<p> <input type="checkbox"  class="filled-in geofence-node" id="#:data._id#" /><label for="#:data._id#"></label></p>'
        }, {
          field: 'type',
          title: 'Type',
          groupHeaderTemplate: '#= value # (#= count#)',
          hidden: true
        }]
      }, App.config.grid);

      config.toolbar = null;
      config.sortable = false;
      config.scrollable = false;
      config.pageable = false;
      config.groupable = false;

      config.height = 'auto';

      config.dataSource.pageSize = 1000;

      config.dataSource.group = {
        field: 'type',
        dir: 'asc',
        aggregates: [{ field: 'type', aggregate: 'count' }]
      };

      config.dataSource.transport.read.url = App.config.apiUrl + '/geofence';

      this.grid = $('#geofence-tree').kendoGrid(config);
    };

    Map.prototype.showGeofenceCreationOverlay = function showGeofenceCreationOverlay() {
      var me = this;
      if (this.drawingManager) {
        this.drawingManager.setMap(this.googleMap);
      } else {
        var clearSelection = function clearSelection() {
          if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
          }
        };

        var setSelection = function setSelection(shape) {
          console.log('setSelection');
          clearSelection();
          selectedShape = shape;
          shape.setEditable(true);
        };

        var deleteSelectedShape = function deleteSelectedShape() {
          if (selectedShape) {
            selectedShape.setMap(null);
          }
        };

        var CenterControl = function CenterControl(controlDiv, map) {
          var controlUI = document.createElement('div');
          controlUI.style.backgroundColor = '#fff';
          controlUI.style.border = '2px solid #fff';
          controlUI.style.borderRadius = '3px';
          controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
          controlUI.style.cursor = 'pointer';
          controlUI.style.marginBottom = '22px';
          controlUI.style.textAlign = 'center';
          controlUI.title = 'Select to delete the shape';
          controlDiv.appendChild(controlUI);

          var controlText = document.createElement('div');
          controlText.style.color = 'rgb(25,25,25)';
          controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
          controlText.style.fontSize = '16px';
          controlText.style.lineHeight = '38px';
          controlText.style.paddingLeft = '5px';
          controlText.style.paddingRight = '5px';
          controlText.innerHTML = 'Delete Selected Area';
          controlUI.appendChild(controlText);

          controlUI.addEventListener('click', function () {
            deleteSelectedShape();
          });
        };

        me.all_overlays = [];
        var selectedShape = void 0;
        this.drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.RECTANGLE]
          },
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.2,
            strokeWeight: 3,
            clickable: false,
            editable: true,
            zIndex: 1
          },
          polygonOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#ffff00',
            fillOpacity: 1

          },
          rectangleOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#ffff00',
            fillOpacity: 0.5
          }
        });

        this.drawingManager.setMap(me.googleMap);

        var getPolygonCoords = function getPolygonCoords(newShape) {
          console.log('We are one');
          var len = newShape.getPath().getLength();
          for (var i = 0; i < len; i++) {
            console.log(newShape.getPath().getAt(i).toUrlValue(6));
          }
        };

        google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function (event) {
          event.getPath().getLength();
          if (event.type === 'polygon') {
            me.newGeofence.geoShape = {};
            me.newGeofence.geoShape.type = event.type;
            me.pathToCoords(event.getPath(), function (coords) {
              me.newGeofence.geoShape.path = coords;
            });
          }
          google.maps.event.addListener(event.getPath(), 'insert_at', function () {
            me.pathToCoords(event.getPath(), function (coords) {
              me.newGeofence.geoShape.path = coords;
            });
          });
          google.maps.event.addListener(event.getPath(), 'set_at', function () {
            me.pathToCoords(event.getPath(), function (coords) {
              me.newGeofence.geoShape.path = coords;
            });
          });
        });

        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (event) {
          me.all_overlays.push(event);

          if (event.type === 'circle') {
            me.newGeofence.geoShape = {};
            me.newGeofence.geoShape.type = event.type;
            me.newGeofence.geoShape.center = event.overlay.getCenter();
            me.newGeofence.geoShape.radius = event.overlay.getRadius();
          } else if (event.type === 'rectangle') {
            me.newGeofence.geoShape = {};
            me.newGeofence.geoShape.type = event.type;
            me.newGeofence.geoShape.bounds = event.overlay.getBounds();
          }
          if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            me.drawingManager.setDrawingMode(null);


            var newShape = event.overlay;
            newShape.type = event.type;
            google.maps.event.addListener(newShape, 'click', function () {
              setSelection(newShape);
            });

            setSelection(newShape);
          }
        });

        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, me.googleMap);

        centerControlDiv.index = 1;
        me.googleMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
      }
    };

    Map.prototype.deleteAllShape = function deleteAllShape() {
      for (var i = 0; i < this.all_overlays.length; i++) {
        this.all_overlays[i].overlay.setMap(null);
      }
      this.all_overlays = [];
    };

    Map.prototype.hideGeofenceCreationOverlay = function hideGeofenceCreationOverlay() {
      this.drawingManager.setMap(null);
    };

    Map.prototype.pathToCoords = function pathToCoords(path, callback) {
      var len = path.length;
      var coords = [];
      for (var i = 0; i < len; i++) {
        coords.push({
          lat: path.getAt(i).lat(),
          lng: path.getAt(i).lng()
        });
      }

      callback && callback(coords);
    };

    Map.prototype.deattached = function deattached() {
      console.info('map deattached');
      this.stopRefresher();
    };

    return Map;
  }()) || _class);
});
define('overview/overview',['exports', 'aurelia-framework', '../http', 'chart.js', '../appState'], function (exports, _aureliaFramework, _http, _chart, _appState) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Overview = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Overview = exports.Overview = (_dec = (0, _aureliaFramework.inject)(_http.Http, _appState.AppState), _dec(_class = function () {
    function Overview(http, appState) {
      _classCallCheck(this, Overview);

      this.App = App;
      this.loading = true;
      this.mapControl = {
        refreshInterval: 20000,
        autoRefresh: true,
        autoPan: true,
        autoZoom: false,
        autoCluster: true
      };
      this.markers = [];
      this.dropMarker = null;
      this.markerSelected = [];
      this.opStatistics = {};
      this.cards = {};

      this.client = http.client;
      this.appState = appState;
    }

    Overview.prototype.attached = function attached() {
      var me = this;
    };

    Overview.prototype.initMap = function initMap(callback) {
      console.log('initMap');

      this.latlngBounds = new google.maps.LatLngBounds();

      this.googleMap = new google.maps.Map(document.getElementById('overviewMap'), {
        zoom: 10,
        center: { lat: 25, lng: 55 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        scrollwheel: false,
        draggable: true,
        styles: [{
          featureType: 'landscape.natural',
          elementType: 'geometry.fill',
          stylers: [{ visibility: 'on' }, { color: '#e0efef' }]
        }, {
          featureType: 'poi',
          elementType: 'geometry.fill',
          stylers: [{ visibility: 'on' }, { hue: '#1900ff' }, { color: '#c0e8e8' }]
        }, {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ lightness: 100 }, { visibility: 'simplified' }]
        }, {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }, {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{ visibility: 'on' }, { lightness: 700 }]
        }, {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#7dcdcd' }]
        }],
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: false,
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
        }
      });

      this.renderLegend(this.googleMap);


      callback();
    };

    Overview.prototype.renderLegend = function renderLegend(map) {
      var legend = this.legend;
      legend.innerHTML = '\n        <div class=\'card map-legend\'>\n          <h7>Legend</h7>\n          <ul>\n            <li><img src="/images/map/icons/on-sm.png"> ON</li>\n            <li><img src="/images/map/icons/off-sm.png"> OFF</li>\n            <li><img src="/images/map/icons/alert-sm.png"> Alarmed</li>\n            <li><img src="/images/map/icons/maintenance-sm.png"> Maintenance</li>\n            <li><img src="/images/map/icons/unknown-sm.png"> Unknown</li>\n            <li><img src="/images/map/icons/decommissioned-sm.png"> Decommissioned</li>\n          </ul>\n        </div>\n        ';
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    };

    Overview.prototype.renderAssetMarkers = function renderAssetMarkers(callback) {
      var me = this;
      this.loadingMap = true;
      if (this.markerCluster) {
        this.removeCluster();
      }

      this.markers = [];

      this.client.get('/map/assets').then(function (res) {
        if (res && res.data) {
          console.info('map');

          var _loop = function _loop(i) {
            var markerInfo = res.data[i];
            var infowindow = new google.maps.InfoWindow({
              content: '\n                               <div id="tabstrip">\n                            <ul>\n                                <li class="k-state-active">\n                                    Event Info\n                                </li>\n                                <li>\n                                    Asset Info\n                                </li>\n                            </ul>\n                            <div>\n                               <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Name</b></td>\n                                            <td><a href=\'#asset-details/' + markerInfo._asset._id + '\'>' + markerInfo._asset.name + '</a></td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Status</b></td>\n                                            <td>' + (markerInfo._asset.status || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Type</b></td>\n                                            <td>' + markerInfo.eventType + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Event Time</b></td>\n                                            <td>' + App.util.format.dateTime(markerInfo.eventTime, App.currentUser.dateTimeFormat) + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Position</b></td>\n                                            <td>' + markerInfo.latitude + ', ' + markerInfo.longitude + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                            <div>\n                                <table>\n                                        <tbody>\n                                            <tr>\n                                            <td><b>Engine Status</b></td>\n                                            <td>' + (markerInfo.engineStatus || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Engine Hour Meter</b></td>\n                                            <td>' + (markerInfo.engineHourMeter || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Supply Voltage</b></td>\n                                            <td>' + (markerInfo.powerSupplyVoltage || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                          <td><b>Coolant Temperature</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.engineCoolantTemperature, 'temperature') || '-') + '</td>\n                                            </tr>\n                                            <tr>\n                                            <td><b>Oil Pressure</b></td>\n                                            <td>' + (App.util.format.item(markerInfo.oilPressure, 'pressure') || '-') + '</td>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                            </div>\n                        </div>\n                                    '
            });

            var iconUrl = '/images/map/icons/unknown.png';
            if (markerInfo._asset.status && markerInfo._asset.status !== 'Deployed') {
              switch (markerInfo._asset.status) {
                case 'Maintenance':
                  iconUrl = '/images/map/icons/maintenance.png';
                  break;

                case 'Decommissioned':
                  iconUrl = '/images/map/icons/decommissioned.png';
                  break;

                default:
                  break;
              }
            } else {
              if (markerInfo._asset && markerInfo._asset.features.engineStatus) {
                switch (markerInfo._asset.features.engineStatus.value) {
                  case 'on':
                    iconUrl = '/images/map/icons/on.png';
                    break;

                  case 'off':
                    iconUrl = '/images/map/icons/off.png';
                    break;

                  default:
                    break;
                }
              }
            }

            var marker = new google.maps.Marker({
              position: {
                lat: parseFloat(markerInfo.latitude),
                lng: parseFloat(markerInfo.longitude)
              },
              title: markerInfo.assetName,
              icon: iconUrl,
              map: me.googleMap,
              id: markerInfo.assetName
            });

            marker.addListener('click', function () {
              infowindow.open(me.googleMap, marker);
            });

            google.maps.event.addListener(infowindow, 'domready', function (e) {
              $('#tabstrip').kendoTabStrip({
                animation: {
                  open: {
                    effects: 'fadeIn'
                  }
                }
              });

              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();

              iwBackground.children(':nth-child(2)').css({ display: 'none' });

              iwBackground.children(':nth-child(4)').css({ display: 'none' });
            });

            me.markers.push(marker);

            me.latlngBounds.extend({
              lat: parseFloat(markerInfo.latitude),
              lng: parseFloat(markerInfo.longitude)
            });
          };

          for (var i = 0; i < res.data.length; i++) {
            _loop(i);
          }

          if (me.mapControl.autoPan) {
            me.autoPan();
          }

          if (me.mapControl.autoCluster) {
            me.addClusters();
          }

          callback && callback();
        }
      });
    };

    Overview.prototype.autoPan = function autoPan() {
      var len = this.markers.length;
      for (var i = 0; i < len; i++) {
        this.markers[i].map && this.latlngBounds.extend(this.markers[i].position);
      }

      this.googleMap.fitBounds(this.latlngBounds);
    };

    Overview.prototype.addClusters = function addClusters() {
      this.markerClusterer = new MarkerClusterer(this.googleMap, this.markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    };

    Overview.prototype.renderPowerOutputBar = function renderPowerOutputBar() {
      var _this = this;

      var dataSource = {};
      var categories = [];
      var series = [];
      this.loadingPowerOutputBar = true;
      this.client.get('/statistics/projectUtilization/poweroutputkwdaily').then(function (res) {
        if (res && res.data) {
          for (var i = 0; i < res.data.length; i++) {
            var day = moment(new Date()).format('dddd');
            categories.push(res.data[i]._project.name);
            if (!dataSource[day]) {
              dataSource[day] = [res.data[i].powerOutputKW];
            } else {
              dataSource[day].push(res.data[i].powerOutputKW);
            }
          }
          for (var key in dataSource) {
            series.push({
              name: key,
              data: dataSource[key]
            });
          }

          $('#powerOutputBar').kendoChart({
            title: {
              text: 'Daily Output Generated'
            },
            theme: 'material',
            legend: {
              position: 'top'
            },
            seriesDefaults: {
              type: 'column'
            },
            seriesColors: ['#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'],
            series: series,
            valueAxis: {
              labels: {
                format: '{0} kVA'
              },
              line: {
                visible: true
              },
              axisCrossingValue: 0
            },
            categoryAxis: {
              categories: categories,
              line: {
                visible: false
              }
            },
            tooltip: {
              visible: true,
              format: '{0} kVA',
              template: '#= series.name #: #= value # kVA'
            }
          });
          _this.loadingPowerOutputBar = false;
        }
      });
    };

    Overview.prototype.renderliveOperationalStatisticsPie = function renderliveOperationalStatisticsPie() {
      var _this2 = this;

      var me = this;
      this.loadingliveOperationalStatistics = true;
      this.loadingliveOperationalStatisticsPie = true;
      this.client.get('/statistics/liveoperationalstatistic').then(function (res) {
        if (res) {
          if (res.data) {
            _this2.opStatistics = res.data.current;
            _this2.opStatisticsPrevious = res.data.previous ? res.data.previous : null;

            var ctx = document.getElementById('operationalPie');
            me.cards.liveoperationalstatistics = new _chart.Chart(ctx, {
              type: 'pie',
              data: {
                labels: ['Not Operational', 'Operational', 'Unknown'],
                datasets: [{
                  data: [me.opStatistics.notOperational, me.opStatistics.operational, me.opStatistics.unknown],
                  backgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa'],
                  hoverBackgroundColor: ['#00838f', '#00acc1', '#b2ebf2', '#e0f7fa']
                }]
              }
            });
          }
        }
        _this2.loadingliveOperationalStatisticsPie = false;
      });
    };

    Overview.prototype.renderMiniAlarms = function renderMiniAlarms() {
      var config = $.extend(true, {
        columns: [{
          field: '_asset.name',
          title: 'Asset',
          filterable: {
            cell: {
              operator: 'contains'
            }
          },
          template: "<a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a>"
        }, {
          field: 'name',
          title: 'Alarm',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'triggerDate',
          title: 'Trigger Date',
          template: '#if(triggerTime){# #: App.util.format.dateTime(triggerTime, App.currentUser.dateTimeFormat) # #}#'
        }]
      }, App.config.grid);

      config.dataBound = function () {};

      config.toolbar = null;

      config.groupable = false;

      config.dataSource.transport.read.url = App.config.apiUrl + '/alarm';

      config.dataSource.transport.read.data = {
        values: 'name,triggerTime,_asset'
      };

      config.dataSource.filter = [{
        field: 'triggered',
        operator: 'eq',
        value: true
      }];

      this.grid = $('#miniAlarms').kendoGrid(config);
    };

    Overview.prototype.deattached = function deattached() {
      console.info('overview deattached');
    };

    return Overview;
  }()) || _class);
});
define('profile/profile',['exports', 'aurelia-framework', 'aurelia-fetch-client', '../http'], function (exports, _aureliaFramework, _aureliaFetchClient, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Profile = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function Profile(aurelia, http, httpclient) {
      _classCallCheck(this, Profile);

      this.loading = true;
      this.controls = {};

      this.client = http.client;
      this.httpclient = httpclient;
      this.aurelia = aurelia;
    }

    Profile.prototype.activate = function activate() {
      this.model = JSON.parse(localStorage.getItem('currentUser'));
      this.loading = false;
    };

    Profile.prototype.attached = function attached() {
      var me = this;

      console.log(me.model);

      this.controls.timezone = $('#timezone').kendoComboBox({
        dataSource: moment.tz.names(),
        filter: 'contains',
        suggest: true,
        value: me.model.timezone ? me.model.timezone : 'Asia/Dubai'
      });

      this.controls.distance = $('#distance').kendoComboBox({
        dataSource: App.config.distance,
        filter: 'contains',
        suggest: true,
        value: me.model.distance ? me.model.distance : 'km'
      });

      this.controls.speed = $('#speed').kendoComboBox({
        dataSource: App.config.speed,
        filter: 'contains',
        suggest: true,
        value: me.model.speed ? me.model.speed : 'km/hr'
      });

      this.controls.pressure = $('#pressure').kendoComboBox({
        dataSource: App.config.pressure,
        filter: 'contains',
        suggest: true,
        value: me.model.v ? me.model.pressure : 'psi'
      });

      this.controls.volume = $('#volume').kendoComboBox({
        dataSource: App.config.volume,
        filter: 'contains',
        suggest: true,
        value: me.model.volume ? me.model.volume : 'l'
      });

      this.controls.temperature = $('#temperature').kendoComboBox({
        dataSource: App.config.temperature,
        filter: 'contains',
        suggest: true,
        value: me.model.temperature ? me.model.temperature : 'Celsius'
      });

      this.controls.dateTimeFormat = $('#dateTime').kendoComboBox({
        dataSource: App.config.dateTimeFormat,
        filter: 'contains',
        suggest: true,
        value: me.model.dateTimeFormat ? me.model.dateTimeFormat : 'D/MM/YYYY h:mm:ss a'
      });

      this.controls.dateFormat = $('#date').kendoComboBox({
        dataSource: App.config.dateFormat,
        filter: 'contains',
        suggest: true,
        value: me.model.dateFormat ? me.model.dateFormat : 'D/MM/YYYY'
      });

      this.controls.timeFormat = $('#time').kendoComboBox({
        dataSource: App.config.timeFormat,
        filter: 'contains',
        suggest: true,
        value: me.model.timeFormat ? me.model.timeFormat : 'h:mm:ss a'
      });
    };

    Profile.prototype.submit = function submit() {
      var _this = this;

      var me = this;
      this.loading = true;

      for (var key in this.controls) {
        this.model[key] = this.controls[key].val();
      }

      this.client.put('/user/' + this.model.loginName, this.model).then(function (data) {
        me.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);

          localStorage.removeItem('currentUser');
          _this.aurelia.setRoot('login/login');
        }
      });
    };

    Profile.prototype.uploadAvatar = function uploadAvatar(images) {
      if (images && images[0]) {
        var image = images[0];
        var filename = void 0;

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

        if (filename) {
          var me = this;

          var formData = new FormData();
          formData.append('images', image, filename);
          formData.append('user', this.model.loginName);

          this.httpclient.fetch(App.config.apiUrl + '/user/photo', {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            localStorage.removeItem('currentUser');
            me.aurelia.setRoot('login/login');
          }).catch(function (error) {
            return Materialize.toast(error.message, 5000);
          });
        }
      } else {
        Materialize.toast('Please upload an image.', 2000);
      }
    };

    return Profile;
  }()) || _class);
});
define('project-admin/project-admin',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _http, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ProjectAdmin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ProjectAdmin = exports.ProjectAdmin = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function ProjectAdmin(http, httpClient) {
      _classCallCheck(this, ProjectAdmin);

      this.loading = true;
      this.model = {
        assets: []
      };
      this.update = false;

      this.client = http.client;
      this.fetchAPI = httpClient;
    }

    ProjectAdmin.prototype.activate = function activate(params) {
      var _this = this;

      console.log('project admin activate');
      if (params.id) {
        this.update = true;
        this.client.get('/project/id/' + params.id).then(function (res) {
          _this.loading = false;
          if (res && res.data) {
            _this.model = res.data[0];
            _this.tagger.add(_this.model.tags);

            if (_this.model.assets.length) {
              $(_this.projectAssets).data('kendoMultiSelect').value(_this.model.assets);

              for (var i = 0; i < _this.model.assets.length; i++) {
                _this.model.assets[i] = _this.model.assets[i];
              }
            }
          }
        });
      } else {
        this.loading = false;
      }
    };

    ProjectAdmin.prototype.attached = function attached() {
      console.log('project admin attached');
      var me = this;

      this.tagger = new Taggle('project-tags', {
        allowDuplicates: false
      });

      $(this.projectAssets).kendoMultiSelect({
        placeholder: 'Select gensets...',
        dataTextField: 'name',
        dataValueField: '_id',
        ignoreCase: false,
        filter: 'contains',
        minLength: 3,
        dataSource: {
          type: 'odata',
          serverFiltering: true,
          transport: {
            read: {
              type: 'GET',
              contentType: 'application/json',
              accept: 'application/json, text/plain, */*',
              dataType: 'json',
              xhrFields: { withCredentials: true },
              url: App.config.apiUrl + '/misc/find/'
            }
          }
        },
        select: function select(e) {
          if (e.dataItem._id) {
            me.model.assets.push(e.dataItem._id);
          }
        },
        deselect: function deselect(e) {
          if (e.dataItem._id) {
            var idx = me.model.assets.indexOf(e.dataItem._id);
            if (idx > -1) {
              me.model.assets.splice(idx, 1);
            }
          }
        }

      });
    };

    ProjectAdmin.prototype.submit = function submit() {
      var _this2 = this;

      this.loading = true;

      if (this.tagger) {
        this.model.tags = this.tagger.getTags().values;
      }

      if (this.update) {
        this.client.put('/project/id/' + this.model._id, this.model).then(function (data) {
          _this2.loading = false;
          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/project-list';
          }
        });
      } else {
        this.client.post('/project/', this.model).then(function (data) {
          _this2.loading = false;
          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/project-list';
          }
        });
      }
    };

    ProjectAdmin.prototype.delete = function _delete() {
      var _this3 = this;

      this.client.delete('/project/id/' + this.model._id).then(function (data) {
        _this3.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);

          window.location.hash = '#/project-list';
        }
      });
    };

    return ProjectAdmin;
  }()) || _class);
});
define('project-list/project-list',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ProjectList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ProjectList = exports.ProjectList = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function ProjectList(http) {
      _classCallCheck(this, ProjectList);

      this.http = http;
    }

    ProjectList.prototype.attached = function attached() {
      var me = this;

      this.tagger = new Taggle('list-tags', {
        allowDuplicates: false,

        onTagAdd: function onTagAdd(event, tag) {
          if (me.tagger) {
            me.renderGrid(me.tagger.getTags().values);
          }
        },

        onTagRemove: function onTagRemove(event, tag) {
          me.renderGrid(me.tagger.getTags().values);
        }
      });

      this.renderGrid();
    };

    ProjectList.prototype.renderGrid = function renderGrid(tags) {
      console.log('render grid');

      var config = $.extend(true, {
        detailTemplate: kendo.template($('#template').html()),
        columns: [{
          template: "<a href='\\#asset-list/#:_id#'>#:name#</a>",
          field: 'name',
          title: 'Project Name',
          width: 150,
          filterable: {
            cell: {
              showOperators: false,
              operator: 'contains',
              suggestionOperator: 'contains'
            }
          }
        }, {
          field: 'assets',
          title: 'Assets',
          filterable: false,
          template: function template(dataItem) {
            var html = [];
            for (var i = 0; i < dataItem.assets.length; i++) {
              if (dataItem.assets[i]) {
                html.push('<a href=\'#asset-details/' + dataItem.assets[i]._id + '\'>' + dataItem.assets[i].name + '</a>');
              }
            }
            return html.join(', ');
          }
        }]
      }, App.config.grid);

      if (App.currentUser.privileges.indexOf(2) > -1) {
        config.toolbar.push({
          template: '<a class="k-button" href="\\#/project-admin"><span class="k-icon k-i-plus-outline"></span> Create New</a>'
        });
      }

      config.dataSource.schema.model.fields = {
        name: { type: 'string' }
      };

      if (tags) {
        config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/project';

      this.grid = $('#projectGrid').kendoGrid(config);
    };

    return ProjectList;
  }()) || _class);
});
define('report-asset-utilization/report-asset-utilization',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ReportAssetUtilization = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ReportAssetUtilization = exports.ReportAssetUtilization = (_dec = (0, _aureliaFramework.inject)(_http.Http), _dec(_class = function () {
    function ReportAssetUtilization(http) {
      _classCallCheck(this, ReportAssetUtilization);

      this.http = http;
    }

    ReportAssetUtilization.prototype.attached = function attached() {
      var me = this;

      this.tagger = new Taggle('list-tags', {
        allowDuplicates: false,

        onTagAdd: function onTagAdd(event, tag) {
          if (me.tagger) {
            me.renderGrid(me.tagger.getTags().values);
          }
        },

        onTagRemove: function onTagRemove(event, tag) {
          me.renderGrid(me.tagger.getTags().values);
        }
      });

      this.renderGrid();
    };

    ReportAssetUtilization.prototype.renderGrid = function renderGrid(tags) {
      console.log('render grid');

      var config = $.extend(true, {
        columns: [{
          template: "# if(_asset.pState == 1){ # <a href='\\#asset-details/#:_asset._id#'>#:_asset.name#</a> # }else{ # #:_asset.name#  # } #",
          field: 'name',
          title: 'Asset Name',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          template: "#: moment(startTime).format('D/M/YYYY') #",
          field: 'startTime',
          title: 'Date'
        }, {
          field: 'powerOutputKW',
          title: 'Power Output in KW',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'averagePowerOutput',
          title: 'Average Power Output in KW',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'totalFuelUsed',
          title: 'Total Fuel Used',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }, {
          field: 'totalEngineHours',
          title: 'Total Engine Hours',
          filterable: {
            cell: {
              operator: 'contains'
            }
          }
        }]
      }, App.config.grid);

      config.dataBound = function () {};

      config.dataSource.schema.model.fields = {
        name: { type: 'string' }
      };

      if (tags) {
        config.dataSource.filter = { field: 'tags', operator: 'eq', value: tags };
      }

      config.dataSource.transport.read.url = App.config.apiUrl + '/statistics/assetutilization';

      this.grid = $('#assetUtilizationGrid').kendoGrid(config);
    };

    return ReportAssetUtilization;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('user-admin/user-admin',['exports', 'aurelia-framework', '../http', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _http, _aureliaFetchClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UserAdmin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var UserAdmin = exports.UserAdmin = (_dec = (0, _aureliaFramework.inject)(_http.Http, _aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function UserAdmin(http, httpClient, router) {
      _classCallCheck(this, UserAdmin);

      this.loading = true;
      this.model = {
        assets: [],
        privileges: []
      };
      this.update = false;
      this.controls = {};

      this.client = http.client;
      this.fetchAPI = httpClient;
      this.router = router;

      this.possiblePrivileges = App.config.privileges;
    }

    UserAdmin.prototype.activate = function activate(params) {
      console.log('user admin activate');
    };

    UserAdmin.prototype.attached = function attached() {
      var _this = this;

      console.log('user admin attached');
      var me = this;
      console.log(this.router.currentInstruction.params);
      if (this.router.currentInstruction.params && this.router.currentInstruction.params.id) {
        var id = this.router.currentInstruction.params.id;

        this.update = true;
        this.client.get('/user/id/' + id).then(function (res) {
          _this.loading = false;
          if (res && res.data) {
            _this.model = res.data[0];
            _this.displayControls();
          }
        });
      } else {
        this.displayControls();
        this.loading = false;
      }
    };

    UserAdmin.prototype.displayControls = function displayControls() {
      var me = this;

      this.controls.timezone = $('#timezone').kendoComboBox({
        dataTextField: 'text',
        dataValueField: 'offset',
        dataSource: App.config.timezone,
        filter: 'contains',
        suggest: true,
        value: me.model.timezone ? me.model.timezone : 4
      });

      this.controls.distance = $('#distance').kendoComboBox({
        dataSource: App.config.distance,
        filter: 'contains',
        suggest: true,
        value: me.model.distance ? me.model.distance : 'km'
      });

      this.controls.speed = $('#speed').kendoComboBox({
        dataSource: App.config.speed,
        filter: 'contains',
        suggest: true,
        value: me.model.speed ? me.model.speed : 'km/hr'
      });

      this.controls.pressure = $('#pressure').kendoComboBox({
        dataSource: App.config.pressure,
        filter: 'contains',
        suggest: true,
        value: me.model.v ? me.model.pressure : 'psi'
      });

      this.controls.volume = $('#volume').kendoComboBox({
        dataSource: App.config.volume,
        filter: 'contains',
        suggest: true,
        value: me.model.volume ? me.model.volume : 'l'
      });
    };

    UserAdmin.prototype.submit = function submit() {
      var _this2 = this;

      this.loading = true;

      for (var key in this.controls) {
        this.model[key] = this.controls[key].val();
      }

      if (this.update) {

        this.client.put('/user/id/' + this.model._id, this.model).then(function (data) {
          _this2.loading = false;

          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/administration';
          }
        });
      } else {

        this.client.post('/user/', this.model).then(function (data) {
          _this2.loading = false;

          if (data && data.message) {
            Materialize.toast(data.message, 5000);

            window.location.hash = '#/administration';
          }
        });
      }
    };

    UserAdmin.prototype.delete = function _delete() {
      var _this3 = this;

      this.client.delete('/user/id/' + this.model._id).then(function (data) {
        _this3.loading = false;
        if (data && data.message) {
          Materialize.toast(data.message, 5000);

          window.location.hash = '#/administration';
        }
      });
    };

    return UserAdmin;
  }()) || _class);
});
define('text!app.css', ['module'], function(module) { module.exports = "body{\r\n    background-color: #fff;\r\n}\r\n\r\nfooter{\r\n  z-index: 3;\r\n    position:fixed;\r\n    padding-top:50px;\r\n    background-color:red;\r\n    bottom:0px;\r\n    left:0px;\r\n    right:0px;\r\n    margin-bottom:0px;\r\n}\r\n\r\nfooter.page-footer .footer-copyright {\r\n    height: 35px;\r\n    line-height: 35px;\r\n}"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"./app.css\"></require><require from=\"./app-header/app-header\"></require><require from=\"./app-navbar/app-navbar\"></require><require from=\"./app-notifications/app-notifications\"></require><require from=\"./app-footer/app-footer\"></require><app-header></app-header><div id=\"main\"><div class=\"wrapper\"><app-navbar></app-navbar><section id=\"content\"><div class=\"container\"><div class=\"section\"><router-view></router-view></div></div></section><app-notifications></app-notifications></div></div><app-footer></app-footer></template>"; });
define('text!ad-admin/ad-admin.html', ['module'], function(module) { module.exports = "<template><div show.bind=\"loading\" class=\"loader\"><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"progress\"><div class=\"indeterminate\"></div></div></div></div></div><div show.bind=\"!loading\"><div class=\"row\"><div class=\"col s12 m7 l7\"><div class=\"card-panel\"><h4 class=\"header2\">Ad Attributes</h4><div class=\"row\"><form class=\"col s12\"><div class=\"input-field col s12\">Name * <input id=\"ad_name\" type=\"text\" value.bind=\"model.name\" name=\"name\" required></div><div class=\"input-field col s12\">Linked URL * <input id=\"ad_linkedUrl\" type=\"text\" value.bind=\"model.linkedUrl\" name=\"linkedUrl\" required></div><div class=\"input-field col s12\"><div id=\"admin-tags\"></div></div><div class=\"input-field col s12\"><h4 class=\"header2\">Ad Image</h4><div class=\"input-field col s12\"><li repeat.for=\"file of images | fileListToArray\"><img src.bind=\"file | blobToUrl\" width=\"100\" height=\"100\"><img></li></div><div class=\"input-field col s12\"><input class=\"input\" type=\"file\" files.bind=\"images\"></div></div><div class=\"row\"><div class=\"input-field col s12 m7 l7\"><div class=\"admin-btns\"><div show.bind=\"!update\"><button data-toggle=\"tab\" class=\"btn cyan waves-effect waves-light right\" click.delegate=\"validateInformation(images)\">Add</button></div><div show.bind=\"update\"><button data-toggle=\"tab\" class=\"btn btn--circle btn-primary submit-property__button\" click.delegate=\"validateInformation(images)\">Update</button> <button class=\"btn red waves-effect waves-light\" click.delegate=\"delete()\">Delete</button></div></div></div></div></form></div></div></div></div></div></template>"; });
define('text!ad-admin/ad-admin.css', ['module'], function(module) { module.exports = ""; });
define('text!ad-list/ad-list.css', ['module'], function(module) { module.exports = ""; });
define('text!ad-list/ad-list.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"input-field col s12\"><div id=\"list-tags\"></div></div></div><div class=\"card\"><div id=\"assetGrid\"></div><script type=\"text/x-kendo-template\" id=\"template\"><div class=\"row\">\r\n                    <div class=\"col s0 m12 l6\">\r\n                        <ul id=\"projects-collection\" class=\"collection\">\r\n                            <li class=\"collection-item avatar\">\r\n                                <span class=\"secondary-content\">\r\n                      <div class=\"row\">\r\n                          <div class=\"col s6\">\r\n                            <a class=\"btn waves-effect waves-light btn-small cyan\"  href='\\\\#ad-details/#:_id#'>View</a>\r\n                          </div>\r\n                          <div class=\"col s5\" style=\"display: #=(App.currentUser.privileges.indexOf(1) > -1)? 'hidden':'none'#\">\r\n                            <a class=\"btn btn-small waves-effect waves-light cyan darken-4\" href='\\\\#ad-admin?id=#:_id#'>Edit</a>\r\n                          </div>\r\n                        </div>\r\n                    </span>\r\n                            </li>\r\n                            <li class=\"collection-item grid-details-item\">\r\n                                <div class=\"row\">\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">Ad Name</p>\r\n                                    </div>\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">#:data.name || '-'#</p>\r\n                                    </div>\r\n                                </div>\r\n                            </li>\r\n                     \r\n                            <li class=\"collection-item grid-details-item\">\r\n                                <div class=\"row\">\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">Image</p>\r\n                                    </div>\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">#:data.yearOfManufacture || '-'#</p>\r\n                                        <img src=\"#:data.imageUrl || '-'#\">\r\n                                    </div>\r\n                                </div>\r\n                            </li>\r\n                            <li class=\"collection-item grid-details-item\">\r\n                                <div class=\"row\">\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">Tags</p>\r\n                                    </div>\r\n                                    <div class=\"col s6\">\r\n                                        <p class=\"collections-content\">\r\n                                            <!--<span class=\"task-cat cyan\">#: tags #</span> -->\r\n                                            #if(typeof data.tags != 'undefined') {# #for (var i=0,len=data.tags.length; i\r\n                                            <len;i++){ # <span class=\"task-cat cyan\">#: data.tags[i] #</span>\r\n                                                # } # # } #\r\n                                        </p>\r\n                                    </div>\r\n                                </div>\r\n                            </li>\r\n                        </ul>\r\n                    </div>\r\n                </div></script></div></template>"; });
define('text!asset-admin/asset-admin.css', ['module'], function(module) { module.exports = ""; });
define('text!administration/administration.html', ['module'], function(module) { module.exports = "<template><div class=\"tabstrip\"><ul><li class=\"k-state-active\">Users</li><li>SMTP</li></ul><div><div class=\"card\"><div class=\"collapsible-header active indigo darken-4 white-text\"></div><i class=\"mdi-social-person\"></i>Users</div><div id=\"appUsers\"></div><script type=\"text/x-kendo-template\" id=\"template\"><div class=\"row\">\r\n                        <div class=\"col s0 m12 l6\">\r\n                            <ul id=\"projects-collection\" class=\"collection\">\r\n                                <li class=\"collection-item avatar\">\r\n                                    <span class=\"secondary-content\">\r\n                  <div class=\"row\">\r\n                      <!--<div class=\"col s6\">\r\n                        <a class=\"btn btn-small cyan darken-1 waves-effect waves-light\"  href='\\\\#asset-details/#:_id#'>View</a>\r\n                      </div>-->\r\n                      <div class=\"col s5\">\r\n                        <a class=\"btn btn-small cyan darken-2 waves-effect waves-light\" href='\\\\#user-admin/#:_id#'>Edit</a>\r\n                      </div>\r\n                    </div>\r\n                </span>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Image</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <img src=\"./uploads/users/#if(imageUrl){# #:imageUrl# #} else{# #:'default.png'# #}#\" onError=\"this.src = './uploads/users/default.png'\"\r\n                                                class=\"circle responsive-img valign profile-image\">\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">DOB</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:dob#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Email</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:email#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Distance Unit</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:distance#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Pressure Unit</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:pressure#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Speed Unit</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:speed#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                                <li class=\"collection-item grid-details-item\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">Volume Unit</p>\r\n                                        </div>\r\n                                        <div class=\"col s6\">\r\n                                            <p class=\"collections-content\">#:volume#</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div></script></div></div><div><div class=\"card-panel\"><h4 class=\"header2\">SMTP Settings</h4><div class=\"row\"><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\">Username <input id=\"asset_name\" type=\"text\" value.bind=\"smtp.user\" name=\"user\" required></div><div class=\"input-field col s12\">Password <input id=\"smtp_name\" type=\"password\" value.bind=\"smtp.pass\" name=\"pass\" required></div><div class=\"input-field col s12 m6\">Port <input id=\"smtp_name\" type=\"text\" value.bind=\"smtp.port\" name=\"port\" required></div><div class=\"input-field col s12 m6\">Host <input id=\"smtp_name\" type=\"text\" value.bind=\"smtp.host\" name=\"host\" required></div></div></form></div><div class=\"row\"><div class=\"input-field col s12 m7 l7\"><div class=\"admin-btns\"><button class=\"btn cyan waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Update</button></div></div></div></div></div></template>"; });
define('text!asset-list/asset-list.css', ['module'], function(module) { module.exports = ""; });
define('text!alarms/alarms.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"collapsible-header active red darken-4 white-text\"><i class=\"mdi-alert-warning\"></i>Active Alarms</div><div id=\"alarms\"></div></div></template>"; });
define('text!login/user-password.css', ['module'], function(module) { module.exports = "html,body{ \r\n\twidth:100%;\r\n\theight:100%;\r\n\t/*background:#111;*/\r\n}\r\n/* ---- particles.js container ---- */\r\n\r\n#particles-js{\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: #000;\r\n  background-image: url('');\r\n  background-size: cover;\r\n  background-position: 50% 50%;\r\n  background-repeat: no-repeat;\r\n}\r\n\r\n\r\n#login-page{\r\n  position: absolute;\r\n  width: 300px;\r\n  height: 200px;\r\n  z-index: 15;\r\n  top: 40%;\r\n  left: 50%;\r\n  margin: -100px 0 0 -150px;\r\n}"; });
define('text!app-footer/app-footer.html', ['module'], function(module) { module.exports = "<template><footer class=\"page-footer\"><div class=\"footer-copyright\"><div class=\"container\">Copyright © 2017 <a class=\"grey-text text-lighten-4\" href=\"#\" target=\"_blank\">RAZRADMIN</a> All rights reserved. <span class=\"right\">Designed and Developed by <a class=\"grey-text text-lighten-4\" href=\"http://razrlab.com\">RAZRLAB</a></span></div></div></footer></template>"; });
define('text!app-header/app-header.html', ['module'], function(module) { module.exports = "<template><header id=\"header\" class=\"page-topbar\"><div class=\"navbar-fixed\"><nav id=\"headerNavBar\"><div class=\"nav-wrapper\"><h1 class=\"logo-wrapper\"><h1 class=\"logo-wrapper hide-on-med-and-down\"><a href=\"index.html\" class=\"brand-logo darken-1\"><img src=\"images/logo/turquoise-sm.png\" alt=\"materialize logo\"></a><span class=\"logo-text\">Materialize</span></h1><ul class=\"right hide-on-med-and-down\"><li><a href=\"javascript:void(0);\" click.delegate=\"toggleFullScreen()\" class=\"waves-effect waves-block waves-light toggle-fullscreen\"><i class=\"mdi-action-settings-overscan\"></i></a></li></ul><ul class=\"right\"><li><input id=\"universal-search\" style=\"width:100%\"></li><li><a href=\"#\" data-activates=\"chat-out\" class=\"waves-effect waves-block waves-light chat-collapse\"><i class=\"mdi-communication-chat\"></i></a></li></ul></h1></div></nav></div></header></template>"; });
define('text!app-navbar/app-navbar.html', ['module'], function(module) { module.exports = "<template><aside id=\"left-sidebar-nav\"><ul id=\"slide-out\" class=\"side-nav fixed leftside-navigation\"><li class=\"user-details cyan darken-2\"><div class=\"row\"><div class=\"col col s4 m4 l4\"><img src=\"./uploads/users/${user.imageUrl}\" class=\"circle responsive-img valign profile-image\"></div><div class=\"col col s8 m8 l8\"><ul id=\"profile-dropdown\" class=\"dropdown-content\"><li><a a route-href=\"route: profile\"><i class=\"mdi-action-face-unlock\"></i> Profile</a></li><li show.bind=\"(user.privileges.indexOf(0) > -1)\"><a route-href=\"route: administration\"><i class=\"mdi-action-settings\"></i>Admin</a></li><li><a href=\"#\"><i class=\"mdi-communication-live-help\"></i> Help</a></li><li class=\"divider\"></li><li><a click.delegate=\"logout()\"><i class=\"mdi-hardware-keyboard-tab\"></i> Logout</a></li></ul><a class=\"btn-flat dropdown-button waves-effect waves-light white-text profile-btn\" href=\"#\" data-activates=\"profile-dropdown\">${user.name}<i class=\"mdi-navigation-arrow-drop-down right\"></i></a><p class=\"user-roal\">Administrator</p></div></div></li><li class=\"bold\"><a class=\"waves-effect waves-cyan\" route-href=\"route: overview\"><i class=\"mdi-action-dashboard\"></i> Dashboard</a></li><li class=\"li-hover\"><div class=\"divider\"></div></li><li class=\"li-hover\"><p class=\"ultra-small margin more-text\">Mobile App Management</p></li><li><a route-href=\"route: ad-list\"><i class=\"mdi-action-trending-up\"></i>Ad Management</a></li><li class=\"li-hover\"><div class=\"divider\"></div></li><li class=\"li-hover\"><p class=\"ultra-small margin more-text\">MORE</p></li><li><a><i class=\"mdi-communication-live-help\"></i> Help</a></li><li class=\"li-hover\"><div class=\"divider\"></div></li></ul><a href=\"#\" data-activates=\"slide-out\" class=\"sidebar-collapse btn-floating btn-medium waves-effect waves-light hide-on-large-only darken-2\"><i class=\"mdi-navigation-menu\"></i></a></aside><div class=\"fixed-action-btn\"><a class=\"btn-floating btn-large red\"><i class=\"large mdi-navigation-apps\"></i></a><ul><li><a class=\"btn-floating yellow darken-1 tooltipped\" style=\"transform:scaleY(.4) scaleX(.4) translateY(40px);opacity:0\" data-position=\"left\" data-delay=\"250\" data-tooltip=\"Support\" click.delegate=\"showSupportDialog()\"><i class=\"large mdi-communication-quick-contacts-dialer\"></i></a></li></ul></div><div id=\"supportDialog\" ref=\"supportDialog\"></div></template>"; });
define('text!app-notifications/app-notifications.html', ['module'], function(module) { module.exports = "<template><aside id=\"right-sidebar-nav\"><ul id=\"chat-out\" class=\"side-nav rightside-navigation\"><li class=\"li-hover\"><a data-activates=\"chat-out\" class=\"chat-close-collapse right\"><i class=\"mdi-navigation-close\"></i></a></li><li class=\"li-hover\"><ul class=\"chat-collapsible\" data-collapsible=\"expandable\"><li><div class=\"collapsible-header teal white-text active\"><i class=\"mdi-social-whatshot\"></i>Recent Activity</div><div class=\"collapsible-body recent-activity\"><div repeat.for=\"item of alarms\"><div class=\"recent-activity-list chat-out-list row\"><div class=\"col s3 recent-activity-list-icon\"><i class=\"mdi-alert-warning\"></i></div><div class=\"col s9 recent-activity-list-text\"><a class=\"chat-close-collapse right\" click.delegate=\"dismissNotification(item._id)\"><i class=\"mdi-navigation-close\"></i></a><p>${App.util.format.dateTime(item.triggerTime, App.currentUser.dateTimeFormat, App.currentUser.timezone)}</p><p>${item.name} for ${item._asset.name}</p></div></div></div></div></li><li><div class=\"collapsible-header red white-text\"><i class=\"mdi-alert-error\"></i>Recent Alarms<i class=\"mdi-hardware-keyboard-arrow-down\"></i></div><div class=\"collapsible-body favorite-associates\"><div repeat.for=\"item of alarms\"><div class=\"favorite-associate-list chat-out-list row\"><div class=\"col s4\"><i class=\"mdi-alert-error medium\"></i></div><div class=\"col s8\"><p><a route-href=\"route: asset-details; params.bind: { id: item._asset._id }\">${item._asset.name}</a></p><p class=\"place\">${item.name}</p><p class=\"place\">${App.util.format.dateTime(item.triggerTime, App.currentUser.dateTimeFormat, App.currentUser.timezone)}</p></div></div></div></div></li></ul></li></ul></aside></template>"; });
define('text!asset-admin/asset-admin.html', ['module'], function(module) { module.exports = "<template><div show.bind=\"loading\" class=\"loader\"><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"progress\"><div class=\"indeterminate\"></div></div></div></div></div><div show.bind=\"!loading\"><div class=\"row\"><div class=\"col s12 m7 l7\"><div class=\"card-panel\"><h4 class=\"header2\">Asset Attributes</h4><div class=\"row\"><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\">Asset Name <input id=\"asset_name\" type=\"text\" value.bind=\"model.name\" name=\"name\" required></div><div class=\"input-field col s12\">Sensor <input id=\"sensor_name\" type=\"text\" value.bind=\"model.sensor\" name=\"sensor\" required></div><div class=\"input-field col s12\">Interface Type <input id=\"interfaceType\" ref=\"interfaceType\" value=\"1\" style=\"width:100%\"></div><div class=\"input-field col s12\">Status <input id=\"status\" ref=\"status\" value=\"1\" style=\"width:100%\"></div></div><div class=\"row\"><div class=\"input-field col s12\">Model <input id=\"modelName_name\" type=\"text\" value.bind=\"model.model\" name=\"model\" required></div><div class=\"input-field col s12\">Manufacturer <input id=\"Manufacturer_input\" type=\"text\" value.bind=\"model.manufacturer\" name=\"manufacturer\" required></div></div><div class=\"row\"><div class=\"input-field col s12\">Control-Panel Manufacturer <input id=\"controlPanelManufacturer_input\" type=\"text\" value.bind=\"model.controlPanelManufacturer\" name=\"controlPanelManufacturer\" required></div><div class=\"input-field col s12\">Year of Manufacture <input id=\"last_name\" type=\"number\" value.bind=\"model.yearOfManufacture\" name=\"yearOfManufacture\" required></div></div><h4 class=\"header2\">Operational Attributes</h4><div class=\"row\"><div class=\"input-field col s12\">Power Rating <input id=\"powerRating_input\" type=\"number\" value.bind=\"model.powerRating\" name=\"powerRating\" required></div><div class=\"input-field col s12\">Generator Capacity <input id=\"generatorCapacity_input\" type=\"number\" value.bind=\"model.generatorCapacity\" name=\"generatorCapacity\" required></div><div class=\"input-field col s12\">Generator Engine Rating <input id=\"generatorEngineRating\" ref=\"generatorEngineRating\" value=\"1\" style=\"width:100%\"></div></div><div class=\"row\"><div class=\"input-field col s12\">Generator Frequency<br><input id=\"generatorFrequency\" ref=\"generatorFrequency\" value=\"1\" style=\"width:100%\"></div><div class=\"input-field col s6\">Power Factor <input id=\"powerFactor_input\" type=\"number\" value.bind=\"model.powerFactor\" name=\"powerFactor\" required></div></div><div class=\"row\"><div class=\"input-field col s12\"><div id=\"admin-tags\"></div></div></div></form></div></div></div><div class=\"col s12 m5 l5\"><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Map Position Status</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"black-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.hasMapPosition.enabled\" disabled=\"disabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div></div><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Engine Status</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"black-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.engineStatus.enabled\" disabled=\"disabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div></div><div class=\"card\"><div class=\"card-content\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">System Odometer</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"black-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.systemOdometer.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action\"><div class=\"row\"><div class=\"input-field col s12\">Offset (hrs) <input id=\"systemOdometerOffset\" type=\"number\" value.bind=\"model.features.systemOdometer.offset\" name=\"systemOdometerOffset\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Non Report</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.nonReport.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Threshold (min) <input id=\"nonReportThreshold\" type=\"number\" value.bind=\"model.features.nonReport.threshold\" name=\"nonReportThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Major Service</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.majorService.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Threshold (hrs) <input id=\"nonReportThreshold\" type=\"number\" value.bind=\"model.features.majorService.threshold\" name=\"nonReportThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Minor Service</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.minorService.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Threshold (hrs) <input id=\"nonReportThreshold\" type=\"number\" value.bind=\"model.features.minorService.threshold\" name=\"nonReportThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">High Supply Voltage</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.highSupplyVoltage.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">High Threshold <input id=\"highSupplyVoltageThreshold\" type=\"number\" value.bind=\"model.features.highSupplyVoltage.threshold\" name=\"highSupplyVoltageThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Low Supply Voltage</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.lowSupplyVoltage.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Low Threshold <input id=\"lowSupplyVoltageThreshold\" type=\"number\" value.bind=\"model.features.lowSupplyVoltage.threshold\" name=\"lowSupplyVoltageThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">High Power Output</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.highPowerOutput.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">High Threshold <input id=\"highPowerOutputThreshold\" type=\"number\" value.bind=\"model.features.highPowerOutput.threshold\" name=\"highPowerOutputThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Low Power Output</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.lowPowerOutput.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Low Threshold <input id=\"lowPowerOutputThreshold\" type=\"number\" value.bind=\"model.features.lowPowerOutput.threshold\" name=\"lowPowerOutputThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">High Coolant Temperature</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.highCoolantTemperature.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Low Threshold <input id=\"highCoolantTemperatureThreshold\" type=\"number\" value.bind=\"model.features.highCoolantTemperature.threshold\" name=\"highCoolantTemperatureThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Frequency</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.frequency.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">High Threshold <input id=\"frequencyThreshold\" type=\"number\" value.bind=\"model.features.frequency.highThreshold\" name=\"frequencyThreshold\" min=\"10\"></div><div class=\"input-field col s12\">Low Threshold <input id=\"frequencyThreshold\" type=\"number\" value.bind=\"model.features.frequency.lowThreshold\" name=\"frequencyThreshold\" min=\"10\"></div></div></div></div><div class=\"card\"><div class=\"card-content red darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><p class=\"card-stats-number\">Oil Pressure</p></div><div class=\"col s9\"><div class=\"switch card-switch\"><label class=\"white-text\">Disable<input type=\"checkbox\" checked.bind=\"model.features.oilPressure.enabled\"> <span class=\"lever\"></span> Enable</label></div></div></div></div><div class=\"card-action blue-grey darken-4 white-text\"><div class=\"row\"><div class=\"input-field col s12\">Threshold <input id=\"oilPressureThreshold\" type=\"number\" value.bind=\"model.features.lowOilPressure.threshold\" name=\"oilPressureThreshold\" min=\"10\"></div></div></div></div></div></div><div class=\"row\"><div class=\"input-field col s12 m7 l7\"><div class=\"admin-btns\"><div show.bind=\"!update\"><button class=\"btn cyan waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Create</button></div><div show.bind=\"update\"><button class=\"btn blue waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Update</button> <button class=\"btn red waves-effect waves-light\" click.delegate=\"delete()\">Delete</button></div></div></div></div></div></template>"; });
define('text!asset-details/asset-details.html', ['module'], function(module) { module.exports = "<template><require from=\"../map/map\"></require><div show.bind=\"loading\" class=\"loader\"><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"progress\"><div class=\"indeterminate\"></div></div></div></div></div><div show.bind=\"!loading\"><div class=\"k-content\"><div id=\"tabstrip\"><ul><li class=\"k-state-active\">Attributes</li><li click.delegate=\"renderEvents()\">Events</li><li click.delegate=\"renderAssetAlarms()\">Alarms</li></ul><div><div id=\"details\" class=\"col s12\"><div id=\"card-stats\"><div class=\"row\"><div class=\"col s12 m4 l4\"><div class=\"card\"><div class=\"card-content blue darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-image-flash-on medium\"></i></div><div class=\"col s9\"><p class=\"card-stats-title\">Average power output</p><h4 class=\"card-stats-number\">${stats.averagePowerOutput}</h4><p class=\"card-stats-compare\" show.bind=\"!stats.controls.averagePowerOutput\"><span class=\"green-text text-lighten-5\">past 24 hours</span></p><p class=\"card-stats-compare\" show.bind=\"stats.controls.averagePowerOutput\"><span class=\"green-text text-lighten-5\">past 7 days</span></p></div></div></div><div class=\"card-action\"><div class=\"switch card-switch\" click.delegate=\"toggleStats('averagePowerOutput')\"><label class=\"black-text\">Day <input type=\"checkbox\" checked.one-way=\"stats.controls.averagePowerOutput\"> <span class=\"lever\"></span> Week</label></div></div></div></div><div class=\"col s12 m4 l4\"><div class=\"card\"><div class=\"card-content blue darken-3 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-maps-local-drink medium\"></i></div><div class=\"col s9\"><p class=\"card-stats-title\">Average fuel consumed</p><h4 class=\"card-stats-number\">${stats.averageFuelConsumed}</h4><p class=\"card-stats-compare\" show.bind=\"!stats.controls.averageFuelConsumed\"><span class=\"green-text text-lighten-5\">past 24 hours</span></p><p class=\"card-stats-compare\" show.bind=\"stats.controls.averageFuelConsumed\"><span class=\"green-text text-lighten-5\">past 7 days</span></p></div></div></div><div class=\"card-action\"><div class=\"switch card-switch\" click.delegate=\"toggleStats('averageFuelConsumed')\"><label class=\"black-text\">Day <input type=\"checkbox\" checked.one-way=\"stats.controls.averageFuelConsumed\"> <span class=\"lever\"></span> Week</label></div></div></div></div><div class=\"col s12 m4 l4\"><div class=\"card\"><div class=\"card-content blue darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-action-restore medium\"></i></div><div class=\"col s9\"><p class=\"card-stats-title\">Average running hours</p><h4 class=\"card-stats-number\">8 hrs/day</h4><p class=\"card-stats-compare\"><span class=\"green-text text-lighten-5\">past 7 days</span></p></div></div></div></div></div></div></div><div class=\"row\"><div class=\"col s12 m6 l6\"><div class=\"card horizontal\"><div class=\"collapsible-header active\"><i class=\"mdi-image-remove-red-eye\"></i>Asset Status</div><div class=\"row\" style=\"text-align:center\"><div class=\"col s12 m3 l3\"><i class=\"mdi-image-flash-on medium green-text\" id=\"runningStatusIcon\"></i><p>Running</p></div><div class=\"col s12 m3 l3\"><i class=\"mdi-image-filter-tilt-shift medium red-text\"></i><p>Oil Check</p></div><div class=\"col s12 m3 l3\"><i class=\"mdi-maps-local-hospital medium green-text\"></i><p>Health Check</p></div><div class=\"col s12 m3 l3\"><i class=\"mdi-content-report medium gray-text lighten-4-text\"></i><p>Fault Report</p></div></div><div class=\"row\"><div class=\"col s12 m12 l12\"><div id=\"gauge-container\" style=\"text-align:center\"><div id=\"gauge\" style=\"display:inline-block\"></div><p>Fuel Level</p></div></div></div></div><div class=\"col s12 m6 l6\"><div class=\"card\"><div class=\"card-content indigo white-text commandBox\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-image-flash-on medium\"></i></div><div class=\"col s9\"><p class=\"card-stats-title\">Remote Start/Stop</p><h4 class=\"card-stats-number\">${commands.remoteStartStop.status}</h4><p class=\"card-stats-compare\"><span>${commands.remoteStartStop.timestamp}</span></p></div></div></div><div class=\"card-action indigo darken-4 commandBoxBtns\"><div id=\"invoice-line\"><div class=\"row\"><div class=\"col s6 m6 l6\"><a class=\"btn medium indigo white-text\" id=\"remoteStart\" ref=\"remoteStart\" click.trigger=\"sendRemoteCommand('remoteStart')\">Start</a></div><div class=\"col s6 m6 l6\"><a class=\"btn medium indigo white-text\" id=\"remoteStop\" ref=\"remoteStop\" click.trigger=\"sendRemoteCommand('remoteStop')\">Stop</a></div></div></div></div></div></div><div class=\"col s12 m6 l6\"><div class=\"card\"><div class=\"card-content indigo white-text commandBox\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-notification-sync-problem medium\"></i></div><div class=\"col s9\"><p class=\"card-stats-title\">Ping</p><h4 class=\"card-stats-number\">Response</h4><p class=\"card-stats-compare\"><span>${commands.ping.timestamp}</span></p></div></div></div><div class=\"card-action indigo darken-4 commandBoxBtns\"><div id=\"invoice-line\"><div class=\"row\"><div class=\"col s6 m12 l12\"><a class=\"btn medium indigo white-text\" click.trigger=\"remotePingCommand()\">Ping</a></div></div></div></div></div></div></div><div class=\"col s12 m6 l6\"><ul materialize=\"collapsible\" class=\"collapsible\" data-collapsible=\"expandable\" [materializeparams]=\"params\"><li><div class=\"collapsible-header active\"><i class=\"mdi-action-info\"></i>Asset Information</div><div class=\"collapsible-body\"><div class=\"row\"><div class=\"col s12 m12 l12\"><ul id=\"projects-collection\" class=\"collection\"><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Asset Name</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.name|| '-'}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Status</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.status|| '-'}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Total Engine Hours</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.engineHours|| '-'}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Coolant Temperature</p></div><div class=\"col s6\"><p class=\"collections-content\">${model.engineCoolantTemperature|| '-'}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Fuel Used since last engine on</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">25 L</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Power Rating</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">50 kVA</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Oil Pressure</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">2.7 bar</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Batery Voltage</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">25.3 V</p></div></div></li></ul></div></div></div></li><li><div class=\"collapsible-header\"><i class=\"mdi-action-speaker-notes\"></i>Extra Information</div><div class=\"collapsible-body\"><div class=\"row\"><div class=\"col s12 m12 l12\"><ul id=\"projects-collection\" class=\"collection\"><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Control Panel Manufacturer</p></div><div class=\"col s6\"><p class=\"collections-content\">${model.controlPanelManufacturer}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Year of Manufacture</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.yearOfManufacture}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Power Rating</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.powerRating}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Generator Engine Rating</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.generatorEngineRating}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Generator Frequency</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">${model.generatorFrequency}</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Tags</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\"></p><div repeat.for=\"item of model.tags\"><span class=\"task-cat cyan\">${item}</span></div><p></p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Projects</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\"></p><div repeat.for=\"item of model._projects\"><span class=\"task-cat cyan\">${item.name}</span></div><p></p></div></div></li></ul></div></div></div></li><li><div class=\"collapsible-header\"><i class=\"mdi-action-track-changes\"></i>Maintenance Information</div><div class=\"collapsible-body\"><div class=\"row\"><div class=\"col s12 m12 l12\"><ul id=\"projects-collection\" class=\"collection\"><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Last performed service</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">430</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Service Interval</p></div><div class=\"col s6\"><p class=\"collections-content\">400</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Next Service Due</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">830</p></div></div></li><li class=\"collection-item\"><div class=\"row\"><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Comments</p></div><div class=\"col s6 l6 m6\"><p class=\"collections-content\">Deployed and service is on schedule</p></div></div></li></ul></div></div></div></li></ul></div></div><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"cards\"><div class=\"card-content\"><div id=\"assetOverviewMap\" style=\"height:550px\"></div><div ref=\"legend\"></div></div></div></div></div><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"card cyan darken-1\"><div class=\"card-content waves-effect waves-block waves-light\"><div class=\"move-up\"><div><span class=\"chart-title white-text\">Power Output</span><div class=\"chart-revenue white-text\"><p class=\"chart-revenue-total\">52 kVA/Hr</p></div></div><div class=\"trending-line-chart-wrapper\"><canvas id=\"powerOutputLine\" height=\"204\" width=\"449\" style=\"width:449px;height:104px\"></canvas></div></div></div></div></div></div></div></div><div><div id=\"eventGrid\"></div></div><div><div class=\"card waves-effect waves-block waves-light\"><div class=\"collapsible-header active red darken-4 white-text\"><i class=\"mdi-alert-warning\"></i>Recent Alarms</div><div id=\"assetAlarms\" ref=\"assetAlarms\"></div></div></div></div></div></div></template>"; });
define('text!asset-list/asset-list.html', ['module'], function(module) { module.exports = "<template><div id=\"card-stats\"><div class=\"row\"><div class=\"col s12 m6 l4\"><div class=\"card\"><div class=\"card-content blue darken-4 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-maps-local-drink medium\"></i></div><div class=\"col s9\"><h4 class=\"card-stats-number\">783 L</h4><p class=\"card-stats-title\">Total fuel used by assets today</p></div></div></div><div class=\"card-action blue darken-4\"><div id=\"clients-bar\"><p class=\"card-stats-compare\"><span class=\"green-text text-lighten-5\"><i class=\"mdi-hardware-keyboard-arrow-up\"></i> 22% from yesterday</span></p></div></div></div></div><div class=\"col s12 m6 l4\"><div class=\"card\"><div class=\"card-content blue darken-3 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-image-flash-on medium\"></i></div><div class=\"col s9\"><h4 class=\"card-stats-number\">12500 kVA</h4><p class=\"card-stats-title\">Total power output generated</p></div></div></div><div class=\"card-action blue darken-3\"><div id=\"clients-bar\"><p class=\"card-stats-compare\"><span class=\"green-text text-lighten-5\"><i class=\"mdi-hardware-keyboard-arrow-down\"></i> 5% from yesterday</span></p></div></div></div></div><div class=\"col s12 m6 l4\"><div class=\"card\"><div class=\"card-content blue darken-2 white-text\"><div class=\"row\"><div class=\"col s3\"><i class=\"mdi-action-schedule medium\"></i></div><div class=\"col s9\"><h4 class=\"card-stats-number\">180 Hrs</h4><p class=\"card-stats-title\">Total running hours for gensets today</p></div></div></div><div class=\"card-action blue darken-2\"><div id=\"clients-bar\"><p class=\"card-stats-compare\"><span class=\"green-text text-lighten-5\"><i class=\"mdi-hardware-keyboard-arrow-down\"></i> 45% from yesterday</span></p></div></div></div></div></div></div><div class=\"row\"><div class=\"col s12 m5 l5\"><div show.bind=\"!noEngineRatingChart\" class=\"card\"><div show.bind=\"loadingEngineRatingChart\" class=\"k-loading-mask\" style=\"width:100%;height:100%\"><span class=\"k-loading-text\">Loading...</span><div class=\"k-loading-image\"><div class=\"k-loading-color\"></div></div></div><div show.bind=\"noEngineRatingChart\" class=\"center\">No data avaliable</div><div class=\"card-content\"><canvas id=\"engineRatingChart\" ref=\"engineRatingChart\"></canvas></div></div></div><div class=\"col s12 m7 l7\"><div show.bind=\"!noCapacityChart\" class=\"card waves-effect waves-block waves-light\"><div show.bind=\"loadingCapacityChart\" class=\"k-loading-mask\" style=\"width:100%;height:100%\"><span class=\"k-loading-text\">Loading...</span><div class=\"k-loading-image\"><div class=\"k-loading-color\"></div></div></div><div class=\"card-content\"><div id=\"capacityChart\" ref=\"capacityChart\"></div></div></div></div></div><div class=\"row\"><div class=\"input-field col s12\"><div id=\"list-tags\"></div></div></div><div class=\"card\"><div id=\"assetGrid\"></div><script type=\"text/x-kendo-template\" id=\"template\"><div class=\"row\">\r\n                <div class=\"col s0 m12 l6\">\r\n                    <ul id=\"projects-collection\" class=\"collection\">\r\n                        <li class=\"collection-item avatar\">\r\n                            <span class=\"secondary-content\">\r\n                  <div class=\"row\">\r\n                      <div class=\"col s6\">\r\n                        <a class=\"btn waves-effect waves-light btn-small cyan\"  href='\\\\#asset-details/#:_id#'>View</a>\r\n                      </div>\r\n                      <div class=\"col s5\" style=\"display: #=(App.currentUser.privileges.indexOf(1) > -1)? 'hidden':'none'#\">\r\n                        <a class=\"btn btn-small waves-effect waves-light cyan darken-4\" href='\\\\#asset-admin?id=#:_id#'>Edit</a>\r\n                      </div>\r\n                    </div>\r\n                </span>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Asset Name</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:data.name || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Control Panel Manufacturer</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:data.controlPanelManufacturer || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Year of Manufacture</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:data.yearOfManufacture || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Power Rating</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:data.powerRating || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Generator Engine Rating</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:data.generatorEngineRating || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Generator Frequency</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#: data.generatorFrequency  || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Tags</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">\r\n                                        <!--<span class=\"task-cat cyan\">#: tags #</span> -->\r\n                                        #if(typeof data.tags != 'undefined') {# #for (var i=0,len=data.tags.length; i\r\n                                        <len;i++){ # <span class=\"task-cat cyan\">#: data.tags[i] #</span>\r\n                                            # } # # } #\r\n                                    </p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Projects</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">\r\n                                        <!--<span class=\"task-cat cyan\">#: _projects #</span> -->\r\n                                        #if(typeof data._projects != 'undefined') {# #for (var i=0,len=data._projects.length; i\r\n                                        <len;i++){ # <span class=\"task-cat cyan\">#: data._projects[i].name #</span>\r\n                                            # } # # } #\r\n                                    </p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div></script></div></template>"; });
define('text!commands/commands.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"card\"><blockquote>Raw Command Box</blockquote><div class=\"card-content\"><div class=\"row\"><div class=\"col s12\"><h6>Choose assets:</h6><select id=\"command-multiselect\"></select></div><div class=\"col s12\"><h6>Write Command below:</h6><textarea value.bind=\"rawCommand\" rows=\"30\" class=\"k-textbox\" style=\"width:100%\">\r\n                        </textarea></div></div></div><div class=\"row\"><div class=\"input-field col s12 m7 l7\"><div class=\"admin-btns\"><div show.bind=\"!update\"><button class=\"btn cyan waves-effect waves-light right\" click.delegate=\"sendCommand()\" disabled.bind=\"btnDisable\">${btnText}</button></div></div></div></div></div></div></div></template>"; });
define('text!geofences/geofences.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"collapsible-header active indigo darken-2 white-text\"><i class=\"mdi-maps-pin-drop\"></i>Geofences</div><div class=\"card-content\"><div id=\"geofences\"></div></div></div><div class=\"row\"><div class=\"col s12 m6 l6\"><div class=\"card\"><blockquote>File Upload</blockquote><div class=\"card-content\"><div class=\"input-field col s12\"><input class=\"input\" type=\"file\" files.bind=\"files\"> <button class=\"btn cyan waves-effect waves-light right upload-btn\" click.delegate=\"massUpload(files)\">Upload</button></div></div></div></div></div></template>"; });
define('text!locations/locations.html', ['module'], function(module) { module.exports = "<template><div class=\"card\"><div class=\"collapsible-header active indigo darken-2 white-text\"><i class=\"mdi-maps-pin-drop\"></i>Points of Interest</div><div class=\"card-content\"><div id=\"locations\"></div></div></div><div class=\"row\"><div class=\"col s12 m6 l6\"><div class=\"card\"><blockquote>File Upload</blockquote><div class=\"card-content\"><div class=\"input-field col s12\"><input class=\"input\" type=\"file\" files.bind=\"files\"> <button class=\"btn cyan waves-effect waves-light right upload-btn\" click.delegate=\"massUpload(files)\">Upload</button></div></div></div></div></div></template>"; });
define('text!login/forgot-password.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template><div id=\"particles-js\"></div><router-view></router-view></template>"; });
define('text!login/user-password.html', ['module'], function(module) { module.exports = "<template><require from=\"./user-password.css\" as=\"scoped\"></require><div id=\"login-page\" class=\"row\"><div class=\"col s12 z-depth-4 card-panel login-card\"><form class=\"login-form\" submit.delegate=\"login()\"><div class=\"row\"><div class=\"input-field col s12 center\"><img src=\"images/logo.png\" alt=\"\" class=\"responsive-img valign\"></div></div><div class=\"row margin\"><div class=\"input-field col s12\"><i class=\"mdi-social-person-outline prefix\"></i> <input id=\"username\" type=\"text\" value.bind=\"model.loginName\" name=\"loginName\" placeholder=\"Username\" required></div></div><div class=\"row margin\"><div class=\"input-field col s12\"><i class=\"mdi-action-lock-outline prefix\"></i> <input id=\"password\" type=\"password\" value.bind=\"model.password\" name=\"password\" placeholder=\"Password\" required></div></div><div class=\"row\"><div class=\"input-field col s12 m12 l12 login-text\"><input type=\"checkbox\" id=\"remember-me\"><label for=\"remember-me\">Remember me</label></div></div><div class=\"row\"><div class=\"input-field col s12\"><button disabled.bind=\"loading\" class=\"btn btn-primary btn waves-effect waves-light col s12\">${loginBtnText}</button></div></div><div class=\"row\"><div class=\"input-field col s6 m6 l6\"></div><div class=\"input-field col s6 m6 l6\"></div></div></form></div></div></template>"; });
define('text!map/map.html', ['module'], function(module) { module.exports = "<template><div show.bind=\"loading\" class=\"loader\"><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"progress\"><div class=\"indeterminate\"></div></div></div></div></div><div show.bind=\"!loading\"><div class=\"row\"><div class=\"col s12 m8 l8\"><div class=\"card\"><div id=\"map\" style=\"height:750px\"></div><div ref=\"legend\"></div></div></div><div class=\"col s12 m4 l4\"><ul class=\"collapsible\" data-collapsible=\"accordion\"><li><div class=\"collapsible-header active\">Assets</div><div class=\"collapsible-body\"><div class=\"card\"><div class=\"card-content\"><select id=\"markerSelect\" data-placeholder=\"Select Assets...\"></select><div class=\"input-field s6\"><a class=\"btn cyan darken-1 waves-effect waves-light\" click.delegate=\"filterMarkers()\">Filter</a> <a class=\"btn cyan darken-2 waves-effect waves-light\" click.delegate=\"renderAssetMarkers()\">All</a></div><div class=\"input-field\"><input type=\"checkbox\" class=\"filled-in\" id=\"autoRefresh\" checked.bind=\"mapControl.autoRefresh\" change.delegate=\"toggleRefresher($event)\"><label for=\"autoRefresh\">Auto-Refresh</label></div><div class=\"input-field\"><input type=\"checkbox\" class=\"filled-in\" id=\"autoPan\" checked.bind=\"mapControl.autoPan\"><label for=\"autoPan\">Auto-Pan</label></div><div class=\"input-field\"><input type=\"checkbox\" class=\"filled-in\" id=\"clustering\" checked.bind=\"mapControl.autoCluster\" change.delegate=\"toggleClusterer($event)\"><label for=\"clustering\">Custering</label></div></div></div></div></li><li><div class=\"collapsible-header\">Locations</div><div class=\"collapsible-body\"><div show.bind=\"locationCreation\"><div class=\"card\"><blockquote><i>Drop a marker on the map to create a location</i></blockquote><div class=\"card-content\"><div class=\"input-field s6\"><div class=\"input-field col s12\">Name <input id=\"locationName_input\" type=\"text\" value.bind=\"newLocation.name\" required></div><div class=\"input-field col s12\">Type <input id=\"locationType_input\" ref=\"locationTypes\" value=\"1\" style=\"width:100%\"></div><div class=\"input-field col s12\">Latitude <input id=\"locationLatitude_input\" type=\"text\" value.bind=\"newLocation.latitude\" required></div><div class=\"input-field col s12\">Longitude <input id=\"locationLongitude_input\" type=\"text\" value.bind=\"newLocation.longitude\" required></div><a class=\"btn small cyan darken-1 waves-effect waves-light\" click.delegate=\"createLocation()\">Create</a> <a class=\"btn small cyan darken-2 waves-effect waves-light\" click.delegate=\"hideLocationCreationModel()\">Cancel</a></div></div></div></div><div class=\"card\"><div class=\"card-content\"><div class=\"input-field s6\"><a class=\"btn small cyan darken-1 waves-effect waves-light\" click.delegate=\"selectLocation()\">Show</a> <a class=\"btn small cyan darken-2 waves-effect waves-light\" click.delegate=\"showLocationCreationModel()\" show.bind=\"App.currentUser.privileges.indexOf(3) > -1\">Create</a></div></div><div id=\"location-tree\"></div></div></div></li><li><div class=\"collapsible-header\">Geofences</div><div class=\"collapsible-body\"><div show.bind=\"geofenceCreation\"><div class=\"card\"><div class=\"card-content\"><div class=\"input-field s6\"><div class=\"input-field col s12\">Name <input id=\"geofenceName_input\" type=\"text\" value.bind=\"newGeofence.name\" required></div><div class=\"input-field col s12\">Location<select id=\"geofence-location\" ref=\"geofenceLocation\" multiple=\"multiple\" data-placeholder=\"Search...\"></select></div><div class=\"input-field col s12\">Type <input id=\"geofenceType_input\" ref=\"geofenceTypes\" value=\"1\" style=\"width:100%\"><br><br></div><a class=\"btn small cyan darken-1 waves-effect waves-light\" click.delegate=\"createGeofence()\">Create</a> <a class=\"btn small cyan darken-2 waves-effect waves-light\" click.delegate=\"hideGeofenceCreationModel()\">Cancel</a></div></div></div></div><div class=\"card\"><div class=\"card-content\"><div class=\"input-field s6\"><a class=\"btn small cyan darken-1 waves-effect waves-light\" click.delegate=\"selectGeofence()\">Show</a> <a class=\"btn small cyan darken-2 waves-effect waves-light\" click.delegate=\"showGeofenceCreationModel()\" show.bind=\"App.currentUser.privileges.indexOf(4) > -1\">Create</a></div></div><div id=\"geofence-tree\"></div></div></div></li></ul></div></div></div></template>"; });
define('text!overview/overview.html', ['module'], function(module) { module.exports = "<template><div id=\"error-page\"><div class=\"row\"><div class=\"col s12\"><div class=\"browser-window\"><div class=\"top-bar\"><div class=\"circles\"><div id=\"close-circle\" class=\"circle\"></div><div id=\"minimize-circle\" class=\"circle\"></div><div id=\"maximize-circle\" class=\"circle\"></div></div></div><div class=\"content\"><div class=\"row\"><div id=\"site-layout-example-top\" class=\"col s12\"><p class=\"flat-text-logo center white-text caption-uppercase\"></p></div><div id=\"site-layout-example-right\" class=\"col s12 m12 l12\"><div class=\"row center\"><h1 class=\"text-long-shadow col s12\">Hello!</h1></div><div class=\"row center\"><p class=\"center white-text col s12\">Welcome to 247HomeRescueApp Management Portal</p><p></p><p></p></div></div></div></div></div></div></div></div></template>"; });
define('text!profile/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col s12 m6 l6\"><div class=\"card-panel\"><h4 class=\"header2\">User Profile</h4><div class=\"row\"><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\">Name <input id=\"name\" type=\"text\" value.bind=\"model.name\" name=\"name\" required></div></div><div class=\"input-field col s12\">Email <input id=\"email5\" type=\"email\" value.bind=\"model.email\" name=\"email\" required></div><div class=\"input-field col s12\">Login Name <input id=\"email5\" type=\"text\" value.bind=\"model.loginName\" name=\"loginName\" disabled=\"disabled\"></div><div class=\"input-field col s12\">Password <input id=\"password6\" type=\"password\" value.bind=\"model.password\" name=\"password\" required></div><div class=\"input-field col s12\">DOB <input type=\"date\" class=\"datepicker\" value.bind=\"model.dob\" name=\"dob\" required></div><h4 class=\"header2\">Measurement Unit</h4><div class=\"input-field col s12\">Timezone <input id=\"timezone\" style=\"width:100%\"></div><div class=\"input-field col s12\">Distance <input id=\"distance\" style=\"width:100%\"></div><div class=\"input-field col s12\">Speed <input id=\"speed\" style=\"width:100%\"></div><div class=\"input-field col s12\">Volume <input id=\"volume\" style=\"width:100%\"></div><div class=\"input-field col s12\">Pressure <input id=\"pressure\" style=\"width:100%\"></div><div class=\"input-field col s12\">Temperature <input id=\"temperature\" style=\"width:100%\"></div><h4 class=\"header2\">Date &nbsp; Time</h4><div class=\"input-field col s12\">DateTime Format <input id=\"dateTime\" style=\"width:100%\"></div><div class=\"input-field col s12\">Date Format <input id=\"date\" style=\"width:100%\"></div><div class=\"input-field col s12\">Time Format <input id=\"time\" style=\"width:100%\"></div><div class=\"row\"><div class=\"input-field col s12\"><button class=\"btn cyan waves-effect waves-light right\" disabled.bind=\"loading\" click.delegate=\"submit()\">Submit</button></div></div></form></div></div></div><div class=\"col s12 m6 l6\"><div class=\"card\"><div class=\"card-content\"><h4 class=\"header2\">Avatar</h4><div class=\"input-field col s12\"><img class=\"materialboxed\" width=\"100\" height=\"100\" src=\"./uploads/users/${model.imageUrl}\"></div><div class=\"input-field col s12\"><input class=\"input\" type=\"file\" files.bind=\"images\"> <button class=\"btn cyan waves-effect waves-light right upload-btn\" click.delegate=\"uploadAvatar(images)\">Upload</button></div></div></div></div></div></template>"; });
define('text!project-admin/project-admin.html', ['module'], function(module) { module.exports = "<template><div show.bind=\"loading\" class=\"loader\"><div class=\"row\"><div class=\"col s12 m12 l12\"><div class=\"progress\"><div class=\"indeterminate\"></div></div></div></div></div><div show.bind=\"!loading\"><div class=\"row\"><div class=\"col s12 m7 l7\"><div class=\"card-panel\"><h4 class=\"header2\">Project Attributes</h4><div class=\"row\"><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\">Project Name <input id=\"project_name\" type=\"text\" value.bind=\"model.name\" name=\"name\" required></div></div><div class=\"row\"><div class=\"input-field col s12\"><div id=\"project-tags\"></div></div><div class=\"input-field col s12\"><select id=\"project-assets\" ref=\"projectAssets\" multiple=\"multiple\" data-placeholder=\"Select Gensets...\"></select></div></div></form></div></div></div></div><div class=\"row\"><div class=\"input-field col s12 m7 l7\"><div class=\"admin-btns\"><div show.bind=\"!update\"><button class=\"btn cyan waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Create</button></div><div show.bind=\"update\"><button class=\"btn blue waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Update</button> <button class=\"btn red waves-effect waves-light\" click.delegate=\"delete()\">Delete</button></div></div></div></div></div></template>"; });
define('text!project-list/project-list.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"input-field col s12\"><div id=\"list-tags\"></div></div></div><div class=\"card\"><div id=\"projectGrid\"></div><script type=\"text/x-kendo-template\" id=\"template\"><div class=\"row\">\r\n                <div class=\"col s0 m12 l6\">\r\n                    <ul id=\"projects-collection\" class=\"collection\">\r\n                        <li class=\"collection-item avatar\">\r\n                            <span class=\"secondary-content\">\r\n                  <div class=\"row\">\r\n                      <div class=\"col s6\">\r\n                        <a class=\"btn waves-effect waves-light btn-small cyan\"  href='\\\\#asset-list/#:_id#'>View</a>\r\n                      </div>\r\n                      <div class=\"col s5\" style=\"display: #=(App.currentUser.privileges.indexOf(2) > -1)? 'hidden':'none'#\">\r\n                        <a class=\"btn btn-small waves-effect waves-light cyan darken-4\" href='\\\\#project-admin?id=#:_id#'>Edit</a>\r\n                      </div>\r\n                    </div>\r\n                </span>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Name</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">#:name || '-'#</p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class=\"collection-item grid-details-item\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">Tags</p>\r\n                                </div>\r\n                                <div class=\"col s6\">\r\n                                    <p class=\"collections-content\">\r\n                                        <!--<span class=\"task-cat cyan\">#: tags #</span> -->\r\n                                        #if(typeof data.tags != 'undefined') {# #for (var i=0,len=data.tags.length; i\r\n                                        <len;i++){ # <span class=\"task-cat cyan\">#: tags[i] #</span>\r\n                                            # } # # } #\r\n                                    </p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div></script></div></template>"; });
define('text!report-asset-utilization/report-asset-utilization.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"input-field col s12\"><div id=\"list-tags\"></div></div></div><div class=\"card\"><div id=\"assetUtilizationGrid\" ref=\"assetUtilizationGrid\"></div></div></template>"; });
define('text!user-admin/user-admin.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col s12 m8 l8\"><div class=\"card-panel\"><h4 class=\"header2\">User Profile</h4><div class=\"row\"><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\">Name <input id=\"name\" type=\"text\" value.bind=\"model.name\" name=\"name\" required></div><div class=\"input-field col s12\">Email <input id=\"email5\" type=\"email\" value.bind=\"model.email\" name=\"email\" required></div><div class=\"input-field col s12\">Login Name <input id=\"email5\" type=\"text\" value.bind=\"model.loginName\" name=\"loginName\" required></div><div class=\"input-field col s12\">Password <input id=\"password6\" type=\"password\" value.bind=\"model.password\" name=\"password\" required></div><div class=\"input-field col s12\">DOB <input type=\"date\" class=\"datepicker\" value.bind=\"model.dob\" name=\"dob\" required></div><h4 class=\"header2\">Measurement Unit</h4><div class=\"input-field col s12\">Timezone <input id=\"timezone\" style=\"width:100%\"></div><div class=\"input-field col s12\">Distance <input id=\"distance\" style=\"width:100%\"></div><div class=\"input-field col s12\">Speed <input id=\"speed\" style=\"width:100%\"></div><div class=\"input-field col s12\">Volume <input id=\"volume\" style=\"width:100%\"></div><div class=\"input-field col s12\">Pressure <input id=\"pressure\" style=\"width:100%\"></div></div></form></div></div></div><div class=\"col s12 m4 l4\" show.bind=\"update\"><div class=\"card\"><div class=\"card-content\"><h4 class=\"header2\">Avatar</h4><div class=\"input-field col s12\"><img class=\"materialboxed\" width=\"100\" height=\"100\" src=\"./uploads/users/${model.imageUrl}\"></div><div class=\"input-field col s12\"><input class=\"input\" type=\"file\" files.bind=\"images\"> <button class=\"btn cyan waves-effect waves-light right upload-btn\" click.delegate=\"uploadAvatar(images)\">Upload</button></div></div></div></div><div class=\"col s12 m4 l4\"><div class=\"card\"><div class=\"card-content\"><h4 class=\"header2\">User Privileges</h4><div class=\"input-field col s12\"><ul repeat.for=\"role of possiblePrivileges\"><p><input type=\"checkbox\" id=\"${role.id}\" model.bind=\"role.id\" checked.bind=\"model.privileges\"><label for=\"${role.id}\">${role.name}</label></p></ul></div></div></div></div><div class=\"row\"><div class=\"input-field col s12\"><div class=\"admin-btns\"><div show.bind=\"!update\"><button class=\"btn cyan waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Create</button></div><div show.bind=\"update\"><button class=\"btn blue waves-effect waves-light right\" name=\"action\" click.delegate=\"submit()\">Update</button> <button class=\"btn red waves-effect waves-light\" click.delegate=\"delete()\">Delete</button></div></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map