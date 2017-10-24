App.util = {
  translate: function(value) {
    return value;
  },
  /**
   * Removes the user's timeZoneOffset to the dates that come go the server.
  * @function {dateToGMT}
  * @param  {Date} value {Date object}
  * @return {Date} {Date object offset per user's profile }
  */
  dateToGMT: function(value) {
    value.setMinutes(value.getMinutes() - App.currentUser.timeZoneOffset);
    return value;
  },
  /**
   * Adds the user's timeZoneOffset to the dates that come from the server.
  * @function {dateToGMT}
  * @param  {Date} value {Date object}
  * @return {Date} {Date object offset per user's profile }
  */
  dateFromGMT: function(value) {
    value.setMinutes(value.getMinutes() + App.currentUser.timezone);
    return value;
  },
  format: {
    date: function(value, format) {
      if (value !== null && value !== '') {
        let formatValue = format || App.config.dateFormat[0];
        let timezone = App.currentUser.timezone || 'Asia/Dubai';
        if (!value.tz) {
          value = moment(value);
        }
        //return converted value
        return value.tz(timezone).format(formatValue);
      } else {
        //return blank
        return App.config.blank;
      }
    },
    time: function(value, format) {
      if (value !== null && value !== '') {
        let formatValue = format || App.config.timeFormat[0];
        let timezone = App.currentUser.timezone || 'Asia/Dubai';
        if (!value.tz) {
          value = moment(value);
        }
        //return converted value
        return value.tz(timezone).format(formatValue);
      } else {
        //return blank
        return App.config.blank;
      }
    },
    dateTime: function(value, format, userTimezone) {
      if (value !== null && value !== '') {
        let formatValue = format || App.config.dateTimeFormat[0];
        let timezone = userTimezone ? userTimezone : 'Asia/Dubai';
        if (!value.tz) {
          value = moment(value);
        }
        //return converted value
        return value.tz(timezone).format(formatValue);
      } else {
        //return blank
        return App.config.blank;
      }
    },
    /**
    * @function {item}
    * @param  {Number} value    {a number value}
    * @param  {String} unitType {a unit which describes the value}
    * @return {String} {a converted value and unit string}
    */
    item: function(value, unitType, suffixFlag) {
      let factor = 1, offset = 0;

      switch (unitType) {
      case 'distance':
        switch (App.currentUser.distance) {
        case 'mi':
              // 1 (international) Mile = 1609.344 meters
          factor = 0.000621371192;
          suffix = App.util.translate(' mi');
          break;

        default:
              //km
          suffix = App.util.translate(' km');
        }
        break;

      case 'speed':
        switch (App.currentUser.speed) {
        case 'mi/hr':
              // 1 (international) Mile = 1609.344 meters
          factor = 1.6;
          suffix = App.util.translate(' mi/hr');
          break;

        default:
          suffix = App.util.translate(' km/hr');
        }
        break;

      case 'temperature':
        switch (App.currentUser.temperature) {
        case 'Fahrenheit':
              // Fahrenheit = Celsius x 1,8 + 32
          factor = 1.8;
          offset = 32;
          suffix = App.util.translate(' °F');
          break;

        default:
          suffix = App.util.translate(' °C');
        }
        break;

      case 'volume':
        switch (App.currentUser.volume) {
        case 'gal':
              // 1 (US.liq.gal.) Gallon = 3.785411784 liters
          factor = 0.26417205235815;
          suffix = App.util.translate(' gal');
          break;

        default:
          suffix = App.util.translate(' l');
        }
        break;

      case 'pressure':
        switch (App.currentUser.pressure) {
        case 'bar':
              // 1 psi = 0.06895 bar
          factor = 0.06895;
          suffix = App.util.translate(' bar');
          break;

        default:
          suffix = App.util.translate(' psi');
        }
        break;

      default:

        // Do nothing.
      }

      if ($.isNumeric(value)) {
        value = value * factor + offset;

        //if decimal
        if (value % 1 != 0) {
          value.toFixed(3);
        }

        return suffixFlag ? value + suffix : value;
      }
    }
  },
  capitalize: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
};
