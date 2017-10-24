App.config = {
  apiUrl: 'http://localhost:80',
  // apiUrl: window.location.origin,
  /**
   * Asset default features
   */
  features: {
    engineStatus: {
      enabled: true,
      name: 'Engine Status'
    },
    inUse: {
      enabled: true,
      name: 'In Use'
    },
    systemOdometer: {
      enabled: false,
      offset: 0,
      name: 'System Odometer'
    },
    hasMapPosition: {
      enabled: true,
      name: 'Has Map Position'
    },
    powerOutputKW: {
      enabled: true,
      name: 'Power Output in KW'
    },
    nonReport: {
      enabled: true,
      name: 'Non Report',
      alarmFeature: true,
      threshold: 10,
      triggered: false
    },
    highCoolantTemperature: {
      enabled: false,
      threshold: 80,
      name: 'High Coolant Temperature',
      alarmFeature: true,
      triggered: false
    },
    majorService: {
      enabled: false,
      threshold: 400,
      name: 'Major Service',
      alarmFeature: true,
      triggered: false
    },
    minorService: {
      enabled: false,
      threshold: 200,
      name: 'Minor Service',
      alarmFeature: true,
      triggered: false
    },
    highSupplyVoltage: {
      enabled: false,
      threshold: 28,
      name: 'High Supply Voltage',
      alarmFeature: true,
      triggered: false
    },
    lowSupplyVoltage: {
      enabled: false,
      threshold: 22,
      name: 'Low Supply Voltage',
      alarmFeature: true,
      triggered: false
    },
    highPowerOutput: {
      enabled: false,
      threshold: 80,
      name: 'High Power Output',
      alarmFeature: true,
      triggered: false
    },
    lowPowerOutput: {
      enabled: false,
      threshold: 20,
      name: 'Low Power Output',
      alarmFeature: true,
      triggered: false
    },
    frequency: {
      enabled: false,
      highThreshold: 53,
      lowThreshold: 47,
      name: 'Frequency',
      alarmFeature: true,
      triggered: false
    },
    lowOilPressure: {
      enabled: false,
      threshold: 40,
      name: 'Low Oil Pressure',
      alarmFeature: true,
      triggered: false
    }
  },
  /**
   * Grid config
   */
  grid: {
    toolbar: ['excel', 'pdf'],
    excel: {
      filterable: true
    },
    // mobile: true,
    filterMenuInit: function (e) {
      if (
        e.sender.dataSource.options.schema.model.fields[e.field] &&
        e.sender.dataSource.options.schema.model.fields[e.field].type === 'date'
      ) {
        let beginOperator = e.container
          .find('[data-role=dropdownlist]:eq(0)')
          .data('kendoDropDownList');
        beginOperator.value('gte');
        beginOperator.trigger('change');
        beginOperator.readonly();

        let logicOperator = e.container
          .find('[data-role=dropdownlist]:eq(1)')
          .data('kendoDropDownList');
        logicOperator.readonly();

        let endOperator = e.container
          .find('[data-role=dropdownlist]:eq(2)')
          .data('kendoDropDownList');
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
        error: function (e) {
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
    dataBound: function () {
      let grid = this;
      setTimeout(function () {
        for (let i = 0; i < grid.columns.length; i++) {
          grid.autoFitColumn(i);
        }
      }, 1000);
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
  interfaceType: [
    'Falcom',
    'FalcomJSON',
    'Shadow',
    'Maestro'
  ],
  /**
   * Generator Frequency
   */
  generatorFrequency: [50, 60],
  /**
   * Generator Status
   */
  generatorStatus: [
    'Deployed',
    'Maintenance',
    'Decommissioned',
    'Ready for deployment'
  ],
  /**
   * Generator Engine Rating
   */
  generatorEngineRating: ['Prime', 'Continuous', 'Standby'],

  //location types
  locationTypes: [
    'construction-site',
    'address',
    'bank',
    'border crossing',
    'building',
    'city',
    'clinic',
    'collection-site',
    'compost-plant',
    'country',
    'customer',
    'customer service center',
    'depot',
    'distribution center'
  ],
  //geofence types
  geofenceTypes: ['inclusive', 'exclusive'],
  /**
   * User profile Settings
   */
  privileges: [
    { id: 0, name: 'Users Administration' },
    { id: 1, name: 'Assets Administration' },
    { id: 2, name: 'Project Administration' },
    { id: 3, name: 'Location Administration' },
    { id: 4, name: 'Geofence Administration' },
    { id: 5, name: 'Alarm Administration' }
  ],
  volume: ['l', 'gal'],
  distance: ['km', 'mi'],
  pressure: ['psi', 'bar'],
  speed: ['km/hr', 'mi/hr'],
  temperature: ['Celsius', 'Fahrenheit'],
  dateTimeFormat: [
    'D/MM/YYYY h:mm:ss a',
    'MM/D/YYYY h:mm:ss a',
    'YYYY-MM-DD h:mm:ss a',
    'YYYY-MM-DD h:mm:ss a',
    'YYYY-MM-DD HH:mm:ss Z'
  ],
  dateFormat: ['D/MM/YYYY', 'MM/D/YYYY', 'YYYY-MM-DD'],
  timeFormat: ['h:mm:ss a', 'HH:mm:ss']
};
