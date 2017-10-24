export class AppState {
  constructor() {
    let me = this;
    this.loggedInUser = null;
    /**
     * Application configuration
     */
    this.config = {
      apiUrl: 'http://localhost:8080',
      // apiUrl: window.location.origin,
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
        // mobile: true,
        filterMenuInit: function(e) {
          if (
            e.sender.dataSource.options.schema.model.fields[e.field] &&
            e.sender.dataSource.options.schema.model.fields[e.field].type ==
              'date'
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
            error: function(e) {
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
        dataBound: function() {
          let grid = this;
          setTimeout(function() {
            for (let i = 0; i < grid.columns.length; i++) {
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
      /**
   * Generator Frequency
   */
      generatorFrequency: [50, 60],
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
      userRole: ['Administrator', 'Operator'],
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
  }
}
