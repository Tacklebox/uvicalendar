/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};

module.exports.formatDate = function formatDate(d, dateonly, floating) {
    var s;

    function pad(i) {
        return (i < 10 ? '0' : '') + i;
    }

    s = d.getUTCFullYear();
    s += pad(d.getUTCMonth() + 1);
    s += pad(d.getUTCDate());

    if(!dateonly) {
        s += 'T';
        s += pad(d.getUTCHours());
        s += pad(d.getUTCMinutes());
        s += pad(d.getUTCSeconds());

        if(!floating) {
            s += 'Z';
        }
    }

    return s;
};

// For information about this format, see RFC 5545, section 3.3.5
// https://tools.ietf.org/html/rfc5545#section-3.3.5
module.exports.formatDateTZ = function formatDateTZ(property, date, eventData) {
    var tzParam = '',
        floating = eventData.floating;

    if(eventData.timezone) {
        tzParam = ';TZID=' + eventData.timezone;

        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }

    return property + tzParam + ':' + module.exports.formatDate(date, false, floating);
};

module.exports.escape = function escape(str) {
    return str.replace(/[\\;,"]/g, function(match) {
        return '\\' + match;
    }).replace(/(?:\r\n|\r|\n)/g, '\\n');
};

module.exports.duration = function duration(seconds) {
    var string = '';

    // < 0
    if(seconds < 0) {
        string = '-';
        seconds *= -1;
    }

    string += 'P';

    // DAYS
    if(seconds >= 86400) {
        string += Math.floor(seconds / 86400) + 'D';
        seconds %= 86400;
    }
    if(!seconds && string.length > 1) {
        return string;
    }

    string += 'T';

    // HOURS
    if(seconds >= 3600) {
        string += Math.floor(seconds / 3600) + 'H';
        seconds %= 3600;
    }

    // MINUTES
    if(seconds >= 60) {
        string += Math.floor(seconds / 60) + 'M';
        seconds %= 60;
    }

    // SECONDS
    if(seconds > 0) {
        string += seconds + 'S';
    }
    else if(string.length <= 2) {
        string += '0S';
    }

    return string;
};

module.exports.toJSON = function(object, attributes, options) {
    var result = {};
    options = options || {};
    options.ignoreAttributes = options.ignoreAttributes || [];
    options.hooks = options.hooks || {};

    attributes.forEach(function(attribute) {
        if(options.ignoreAttributes.indexOf(attribute) !== -1) {
            return;
        }

        var value = object[attribute](),
            newObj;

        if(options.hooks[attribute]) {
            value = options.hooks[attribute](value);
        }
        if(!value) {
            return;
        }

        result[attribute] = value;

        if(Array.isArray(result[attribute])) {
            newObj = [];
            result[attribute].forEach(function(object) {
                newObj.push(object.toJSON());
            });
            result[attribute] = newObj;
        }
    });

    return result;
};

module.exports.foldLines = function(input) {
    return input.split('\r\n').map(function(line) {
        return line.match(/(.{1,74})/g).join('\r\n ');
    }).join('\r\n');
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * @author Sebastian Pekarek
 * @module event
 * @constructor ICalEvent Event
 */
var ICalEvent = function(_data, calendar) {
    var attributes = ['id', 'uid', 'sequence', 'start', 'end', 'timezone', 'stamp', 'timestamp', 'allDay', 'floating', 'repeating', 'summary', 'location', 'description', 'organizer', 'attendees', 'alarms', 'method', 'status', 'url'],
        vars,
        i,
        data;

    if(!calendar) {
        throw '`calendar` option required!';
    }

    vars = {
        allowedRepeatingFreq: ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        allowedStatuses: ['CONFIRMED', 'TENTATIVE', 'CANCELLED']
    };

    data = {
        id: ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4),
        sequence: 0,
        start: null,
        end: null,
        timezone: undefined,
        stamp: new Date(),
        allDay: false,
        floating: false,
        repeating: null,
        summary: '',
        location: null,
        description: null,
        htmlDescription: null,
        organizer: null,
        attendees: [],
        alarms: [],
        status: null,
        url: null
    };

    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.id = function(id) {
        if(!id) {
            return data.id;
        }

        data.id = id;
        return this;
    };


    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @alias id
     * @returns {ICalEvent|String}
     */
    this.uid = this.id;


    /**
     * Set/Get the event's SEQUENCE number
     *
     * @param {Number} sequence
     * @since 0.2.6
     * @returns {ICalEvent|Number}
     */
    this.sequence = function(sequence) {
        if(sequence === undefined) {
            return data.sequence;
        }

        var s = parseInt(sequence, 10);
        if(isNaN(s)) {
            throw '`sequence` must be a number!';
        }

        data.sequence = s;
        return this;
    };

    /**
     * Set/Get the event's start date
     *
     * @param {Date} start
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.start = function(start) {
        if(!start) {
            return data.start;
        }


        if(typeof start === 'string') {
            start = new Date(start);
        }
        if(!(start instanceof Date) || isNaN(start.getTime())) {
            throw '`start` must be a Date Object!';
        }
        data.start = start;

        if(data.start && data.end && data.start > data.end) {
            var t = data.start;
            data.start = data.end;
            data.end = t;
        }
        return this;
    };


    /**
     * Set/Get the event's end date
     *
     * @param {Date} end
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.end = function(end) {
        if(end === undefined) {
            return data.end;
        }

        if(!end) {
            data.end = null;
            return this;
        }
        if(typeof end === 'string') {
            end = new Date(end);
        }
        if(!(end instanceof Date) || isNaN(end.getTime())) {
            throw '`end` must be a Date Object!';
        }
        data.end = end;

        if(data.start && data.end && data.start > data.end) {
            var t = data.start;
            data.start = data.end;
            data.end = t;
        }
        return this;
    };


    /**
     * Set/Get the event's timezone.  This unsets the event's floating flag.
     * Used on date properties
     *
     * @param [timezone] Timezone
     * @example event.timezone('America/New_York');
     * @since 0.2.6
     * @returns {ICalEvent|String}
     */
    this.timezone = function(timezone) {
        if(timezone === undefined && data.timezone !== undefined) {
            return data.timezone;
        }
        if(timezone === undefined) {
            return calendar.timezone();
        }

        data.timezone = timezone ? timezone.toString() : null;
        if(data.timezone) {
            data.floating = false;
        }
        return this;
    };


    /**
     * Set/Get the event's timestamp
     *
     * @param {Date} stamp
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.stamp = function(stamp) {
        if(!stamp) {
            return data.stamp;
        }

        if(typeof stamp === 'string') {
            stamp = new Date(stamp);
        }
        if(!(stamp instanceof Date) || isNaN(stamp.getTime())) {
            throw '`stamp` must be a Date Object!';
        }
        data.stamp = stamp;
        return this;
    };


    /**
     * SetGet the event's timestamp
     *
     * @param {Date} stamp
     * @since 0.2.0
     * @alias stamp
     * @returns {ICalEvent|Date}
     */
    this.timestamp = this.stamp;


    /**
     * Set/Get the event's allDay flag
     *
     * @param {Boolean} allDay
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    this.allDay = function(allDay) {
        if(allDay === undefined) {
            return data.allDay;
        }

        data.allDay = !!allDay;
        return this;
    };


    /**
     * Set/Get the event's floating flag.  This unsets the event's timezone.
     * See https://tools.ietf.org/html/rfc5545#section-3.3.12
     *
     * @param {Boolean} floating
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    this.floating = function(floating) {
        if(floating === undefined) {
            return data.floating;
        }

        data.floating = !!floating;
        if(data.floating) {
            data.timezone = null;
        }
        return this;
    };


    /**
     * Set/Get the event's repeating stuff
     *
     * @param repeating
     * @since 0.2.0
     * @returns {ICalEvent|Object}
     */
    this.repeating = function(repeating) {
        if(repeating === undefined) {
            return data.repeating;
        }
        if(!repeating) {
            data.repeating = null;
            return this;
        }

        if(!repeating.freq || vars.allowedRepeatingFreq.indexOf(repeating.freq.toUpperCase()) === -1) {
            throw '`repeating.freq` is a mandatory item, and must be one of the following: ' + vars.allowedRepeatingFreq.join(', ') + '!';
        }
        data.repeating = {
            freq: repeating.freq.toUpperCase()
        };

        if(repeating.count) {
            if(!isFinite(repeating.count)) {
                throw '`repeating.count` must be a Number!';
            }

            data.repeating.count = repeating.count;
        }

        if(repeating.interval) {
            if(!isFinite(repeating.interval)) {
                throw '`repeating.interval` must be a Number!';
            }

            data.repeating.interval = repeating.interval;
        }

        if(repeating.until) {
            if(typeof repeating.until === 'string') {
                repeating.until = new Date(repeating.until);
            }
            if(!(repeating.until instanceof Date) || isNaN(repeating.until.getTime())) {
                throw '`repeating.until` must be a Date Object!';
            }

            data.repeating.until = repeating.until;
        }

        if(repeating.byDay) {
            if(!Array.isArray(repeating.byDay)) {
                repeating.byDay = [repeating.byDay];
            }

            data.repeating.byDay = [];
            repeating.byDay.forEach(function(symbol) {
                var s = symbol.toString().toUpperCase().match(/^(\d*||-\d+)(\w+)$/);
                if(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(s[2]) === -1) {
                    throw '`repeating.byDay` contains invalid value `' + s[2] + '`!';
                }

                data.repeating.byDay.push(s[1] + s[2]);
            });
        }

        if(repeating.byMonth) {
            if(!Array.isArray(repeating.byMonth)) {
                repeating.byMonth = [repeating.byMonth];
            }

            data.repeating.byMonth = [];
            repeating.byMonth.forEach(function(month) {
                if(typeof month !== 'number' || month < 1 || month > 12) {
                    throw '`repeating.byMonth` contains invalid value `' + month + '`!';
                }

                data.repeating.byMonth.push(month);
            });
        }

        if(repeating.byMonthDay) {
            if(!Array.isArray(repeating.byMonthDay)) {
                repeating.byMonthDay = [repeating.byMonthDay];
            }

            data.repeating.byMonthDay = [];
            repeating.byMonthDay.forEach(function(monthDay) {
                if(typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                    throw '`repeating.byMonthDay` contains invalid value `' + monthDay + '`!';
                }

                data.repeating.byMonthDay.push(monthDay);
            });
        }

        if(repeating.exclude) {
            if(!Array.isArray(repeating.exclude)) {
                repeating.exclude = [repeating.exclude];
            }

            data.repeating.exclude = [];
            repeating.exclude.forEach(function(excludedDate) {
                var originalDate = excludedDate;
                if(typeof excludedDate === 'string') {
                    excludedDate = new Date(excludedDate);
                }

                if(Object.prototype.toString.call(excludedDate) !== '[object Date]' || isNaN(excludedDate.getTime())) {
                    throw '`repeating.exclude` contains invalid value `' + originalDate + '`!';
                }

                data.repeating.exclude.push(excludedDate);
            });
        }

        return this;
    };


    /**
     * Set/Get the event's summary
     *
     * @param {String} summary
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.summary = function(summary) {
        if(summary === undefined) {
            return data.summary;
        }

        data.summary = summary ? summary.toString() : '';
        return this;
    };


    /**
     * Set/Get the event's location
     *
     * @param {String} location
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.location = function(location) {
        if(location === undefined) {
            return data.location;
        }

        data.location = location ? location.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's description
     *
     * @param {String} description
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.description = function(description) {
        if(description === undefined) {
            return data.description;
        }

        data.description = description ? description.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's HTML description
     *
     * @param {String} description
     * @since 0.2.8
     * @returns {ICalEvent|String}
     */
    this.htmlDescription = function(htmlDescription) {
        if(htmlDescription === undefined) {
            return data.htmlDescription;
        }

        data.htmlDescription = htmlDescription ? htmlDescription.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's organizer
     *
     * @param {Object} organizer
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.organizer = function(_organizer) {
        if(_organizer === undefined) {
            return data.organizer;
        }
        if(!_organizer) {
            data.organizer = null;
            return this;
        }

        var organizer = null,
            organizerRegEx = /^(.+) ?<([^>]+)>$/;

        if(typeof _organizer === 'string' && organizerRegEx.test(_organizer)) {
            organizer = {
                name: RegExp.$1.trim(),
                email: RegExp.$2
            };
        }
        else if(typeof _organizer === 'object') {
            organizer = {
                name: _organizer.name,
                email: _organizer.email
            };
        }
        else if(typeof _organizer === 'string') {
            throw '`organizer` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
        }
        else {
            throw '`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
        }

        if(!organizer.name) {
            throw '`organizer.name` is empty!';
        }
        if(!organizer.email) {
            throw '`organizer.email` is empty!';
        }

        data.organizer = {
            name: organizer.name,
            email: organizer.email
        };
        return this;
    };


    /**
     * Create a new Attendee and return the attendee object…
     *
     * @param [attendeeData] Attendee-Options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.createAttendee = function(_attendeeData) {
        var ICalAttendee = __webpack_require__(6),
            attendeeRegEx = /^(.+) ?<([^>]+)>$/,
            attendee;

        if(typeof _attendeeData === 'string' && attendeeRegEx.test(_attendeeData)) {
            attendee = new ICalAttendee({
                name: RegExp.$1.trim(),
                email: RegExp.$2
            }, this);

            data.attendees.push(attendee);
            return attendee;
        }
        if(typeof _attendeeData === 'string') {
            throw '`attendee` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#createattendeeobject-options';
        }

        attendee = new ICalAttendee(_attendeeData, this);
        data.attendees.push(attendee);
        return attendee;
    };


    /**
     * Get all attendees or add attendees…
     *
     * @since 0.2.0
     * @returns {ICalAttendees[]|ICalEvent}
     */
    this.attendees = function(attendees) {
        if(!attendees) {
            return data.attendees;
        }

        var cal = this;
        attendees.forEach(function(e) {
            cal.createAttendee(e);
        });
        return cal;
    };


    /**
     * Create a new Alarm and return the alarm object…
     *
     * @param [alarmData] Alarm-Options
     * @since 0.2.1
     * @returns {ICalAlarm}
     */
    this.createAlarm = function(alarmData) {
        var ICalAlarm = __webpack_require__(7),
            alarm = new ICalAlarm(alarmData, this);

        data.alarms.push(alarm);
        return alarm;
    };


    /**
     * Get all alarms or add alarms…
     *
     * @since 0.2.0
     * @returns {ICalAlarms[]|ICalEvent}
     */
    this.alarms = function(alarms) {
        if(!alarms) {
            return data.alarms;
        }

        var cal = this;
        alarms.forEach(function(e) {
            cal.createAlarm(e);
        });
        return cal;
    };


    /**
     * Set/Get your feed's method
     *
     * @param {String} method
     * @since 0.2.0
     * @deprecated since 0.2.8
     * @returns {ICalEvent|String}
     */
    this.method = function(method) {
        if(method === undefined) {
            return calendar.method();
        }
        if(!method) {
            calendar.method(null);
            return this;
        }

        calendar.method(method);
        return this;
    };


    /**
     * Set/Get the event's status
     *
     * @param {String} status
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.status = function(status) {
        if(status === undefined) {
            return data.status;
        }
        if(!status) {
            data.status = null;
            return this;
        }

        // https://github.com/sebbo2002/ical-generator/issues/45
        if(status === 'TENATIVE') {
            status = 'TENTATIVE';
        }
        if(vars.allowedStatuses.indexOf(status.toUpperCase()) === -1) {
            throw '`status` must be one of the following: ' + vars.allowedStatuses.join(', ') + '!';
        }

        data.status = status.toUpperCase();
        return this;
    };


    /**
     * Set/Get the event's URL
     *
     * @param {String} url URL
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.url = function(url) {
        if(url === undefined) {
            return data.url;
        }

        data.url = url ? url.toString() : null;
        return this;
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = __webpack_require__(0);
        return tools.toJSON(this, attributes);
    };


    /**
     * Export Event to iCal
     *
     * @param {ICalCalendar}
     * @since 0.2.0
     * @returns {String}
     */
    this.generate = function(calendar) {
        var tools = __webpack_require__(0),
            g = '';

        if(!calendar) {
            throw '`calendar` option required!';
        }
        if(!data.start) {
            throw 'No value for `start` in ICalEvent #' + data.id + ' given!';
        }
        if(data.timezone) {
            data.floating = false;
        }

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + data.id + '@' + calendar.domain() + '\r\n';

        // SEQUENCE
        g += 'SEQUENCE:' + data.sequence + '\r\n';

        g += 'DTSTAMP:' + tools.formatDate(data.stamp) + '\r\n';
        if(data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + tools.formatDate(data.start, true) + '\r\n';
            if(data.end) {
                g += 'DTEND;VALUE=DATE:' + tools.formatDate(data.end, true) + '\r\n';
            }

            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        } else {
            g += tools.formatDateTZ('DTSTART', data.start, data) + '\r\n';
            if(data.end) {
                g += tools.formatDateTZ('DTEND', data.end, data) + '\r\n';
            }
        }

        // REPEATING
        if(data.repeating) {
            g += 'RRULE:FREQ=' + data.repeating.freq;

            if(data.repeating.count) {
                g += ';COUNT=' + data.repeating.count;
            }

            if(data.repeating.interval) {
                g += ';INTERVAL=' + data.repeating.interval;
            }

            if(data.repeating.until) {
                g += ';UNTIL=' + tools.formatDate(data.repeating.until);
            }

            if(data.repeating.byDay) {
                g += ';BYDAY=' + data.repeating.byDay.join(',');
            }

            if(data.repeating.byMonth) {
                g += ';BYMONTH=' + data.repeating.byMonth.join(',');
            }

            if(data.repeating.byMonthDay) {
                g += ';BYMONTHDAY=' + data.repeating.byMonthDay.join(',');
            }

            g += '\r\n';

            // REPEATING EXCLUSION
            if(data.repeating.exclude) {
                g += 'EXDATE:';
                var sArr = [];
                data.repeating.exclude.forEach(function(excludedDate) {
                    sArr.push(tools.formatDate(excludedDate));
                });
                g += sArr.join(',');

                g += '\r\n';
            }
        }

        // SUMMARY
        g += 'SUMMARY:' + tools.escape(data.summary) + '\r\n';

        // LOCATION
        if(data.location) {
            g += 'LOCATION:' + tools.escape(data.location) + '\r\n';
        }

        // DESCRIPTION
        if(data.description) {
            g += 'DESCRIPTION:' + tools.escape(data.description) + '\r\n';
        }

        // HTML DESCRIPTION
        if(data.htmlDescription) {
            g += 'X-ALT-DESC;FMTTYPE=text/html:' + tools.escape(data.htmlDescription) + '\r\n';
        }

        // ORGANIZER
        if(data.organizer) {
            g += 'ORGANIZER;CN="' + tools.escape(data.organizer.name) + '":mailto:' + tools.escape(data.organizer.email) + '\r\n';
        }

        // ATTENDEES
        data.attendees.forEach(function(attendee) {
            g += attendee.generate();
        });

        // ALARMS
        data.alarms.forEach(function(alarm) {
            g += alarm.generate();
        });

        // URL
        if(data.url) {
            g += 'URL;VALUE=URI:' + tools.escape(data.url) + '\r\n';
        }

        // STATUS
        if(data.status) {
            g += 'STATUS:' + data.status.toUpperCase() + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
    };


    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalEvent;


/***/ }),
/* 2 */
/***/ (function(module, exports) {



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

let page_title = document.querySelector("div.pagetitlediv h2")
if (page_title.textContent == "View detailed timetable") {
  let export_button = document.createElement("a")
  export_button.appendChild(document.createTextNode("export"))
  export_button.href = "#"
  export_button.id = "uvical_export"
  export_button.addEventListener("click", export_schedule)
  let header_links = document.querySelector("span.pageheaderlinks")
  let old_button = header_links.querySelector("#uvical_export")
  if (old_button) { header_links.removeChild(old_button) }
  header_links.insertBefore(export_button, header_links.firstChild)
}

function export_schedule() {
  getCSSRule('.datadisplaytable').style.opacity = ''
  let calendar_title = "UVic Schedule: " + document.querySelector('div.staticheaders').childNodes[2].textContent.split(': ')[1]
  let class_section_list = document.querySelectorAll("div#P_CrseSchdDetl > table.datadisplaytable")
  let class_objects = []
  class_section_list.forEach((class_selection) => {
    let class_object = {}
    class_object.summary       = class_selection.querySelector("caption").textContent
    let info_table = class_selection.querySelector("table.datadisplaytable.tablesorter > tbody > tbody")

    let [start_date, end_date] = info_table.rows[0].cells[4].textContent.split('-').map(el => el.trim())
    let first_day_in_range     = new Date(start_date).getDay()
    let first_occurrance_order = []

    for (let i = 0; i < 7; i++) {
      first_occurrance_order.push((first_day_in_range + i) % 7)
    }

    let days_raw = info_table.rows[0].cells[2].textContent
    let days     = []

    for (let i = 0; i < days_raw.length; i++) {
      days.push(dayCharToInt(days_raw[i]))
    }

    let first_occurrance_offset = Math.min(...days.map(day=>first_occurrance_order.indexOf(day)))

    let [start_time, end_time] = info_table.rows[0].cells[1].textContent.split('-').map(el => to24(el.trim()))
    start_time = new Date(start_date + " " + start_time)
    end_time = new Date(start_date + " " + end_time)
    
    class_object.location = info_table.rows[0].cells[3].textContent
    class_object.start    = new Date(start_time.setTime(start_time.getTime() + (first_occurrance_offset * 86400000)))
    class_object.end      = new Date(end_time.setTime(end_time.getTime() + (first_occurrance_offset * 86400000)))
    
    if (start_date != end_date) {
      class_object.repeating = {
        freq: 'WEEKLY',
        until: new Date(end_date),
      }
      if (days.length > 1) {
        class_object.repeating.byDay = []
        days.forEach((day) => {
          class_object.repeating.byDay.push(dayIntToICAL(day))
        })
      }
    }
    
    class_objects.push(class_object)
  })
  let cal = __webpack_require__(4)({name: calendar_title, prodId: '//maxwellborden.com//UVICalendar//EN', timezone: 'Americas/Vancouver', events: class_objects})
  let modal_cover = document.createElement('div')
  modal_cover.style.width          = '100%'
  modal_cover.style.height         = '100%'
  modal_cover.style.position       = 'fixed'
  modal_cover.style.background     = 'rgba(0,0,0,0.65)'
  modal_cover.style.display        = 'flex'
  modal_cover.style.alignItems     = 'center'
  modal_cover.style.justifyContent = 'center'
  document.body.insertBefore(modal_cover, document.body.firstChild)
  let modal = document.createElement('div')
  modal.style.background     = 'white'
  modal.style.width          = '180px'
  modal.style.height         = '40px'
  modal.style.display        = 'flex'
  modal.style.alignItems     = 'center'
  modal.style.justifyContent = 'center'
  modal_cover.appendChild(modal)
  let download_uri = document.createElement('a')
  download_uri.textContent = 'Download iCal'
  download_uri.download = calendar_title + '.calendar'
  download_uri.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cal.toString())
  modal.appendChild(download_uri)
}

// Thanks to user Jorge Gonzalez on stack overflow for this function!
function getCSSRule(ruleName) {
  ruleName = ruleName.toLowerCase();
  var result = null;
  var find = Array.prototype.find;

  find.call(document.styleSheets, styleSheet => {
    result = find.call(styleSheet.cssRules, cssRule => {
      return cssRule instanceof CSSStyleRule 
        && cssRule.selectorText.toLowerCase() == ruleName;
    });
    return result != null;
  });
  return result;
}

function to24(time) {
  let [hours, minutes] = time.split(':').map(el=>parseInt(el))
  if (time.endsWith('pm')) {
    hours += 12
  }
  return hours.toString()+':'+ (minutes == 0?"00":minutes.toString())
}

function dayCharToInt(dayChar) {
      switch (dayChar.toLowerCase()) {
        case 'm':
          return 1
        case 't':
          return 2
        case 'w':
          return 3
        case 'r':
          return 4
        case 'f':
          return 5
      }
}

function dayIntToICAL(dayInt) {
  switch(dayInt) {
    case 1:
      return 'mo'
    case 2:
      return 'tu'
    case 3:
      return 'we'
    case 4:
      return 'th'
    case 5:
      return 'fr'
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function(data) {
    'use strict';

    /**
     * @type {ICalCalendar}
     */
    var Calendar = __webpack_require__(5);
    return new Calendar(data);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * @author Sebastian Pekarek
 * @module calendar
 * @constructor ICalCalendar Calendar
 */
var ICalCalendar = function(_data) {
    var data = {},
        attributes = ['domain', 'prodId', 'method', 'name', 'description', 'timezone', 'ttl', 'url', 'events'],
        vars,
        generate,
        i;

    vars = {
        allowedMethods: ['PUBLISH', 'REQUEST', 'REPLY', 'ADD', 'CANCEL', 'REFRESH', 'COUNTER', 'DECLINECOUNTER']
    };

    generate = function(calendar) {
        var tools = __webpack_require__(0),
            g = '';

        // VCALENDAR and VERSION
        g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';

        // PRODID
        g += 'PRODID:-' + data.prodid + '\r\n';

        // URL
        if(data.url) {
            g += 'URL:' + data.url + '\r\n';
        }

        // METHOD
        if(data.method) {
            g += 'METHOD:' + data.method + '\r\n';
        }

        // NAME
        if(data.name) {
            g += 'NAME:' + data.name + '\r\n';
            g += 'X-WR-CALNAME:' + data.name + '\r\n';
        }

        // Description
        if(data.description) {
            g += 'X-WR-CALDESC:' + data.description + '\r\n';
        }

        // Timezone
        if(data.timezone) {
            g += 'TIMEZONE-ID:' + data.timezone + '\r\n';
            g += 'X-WR-TIMEZONE:' + data.timezone + '\r\n';
        }

        // TTL
        if(data.ttl) {
            g += 'REFRESH-INTERVAL;VALUE=DURATION:' + tools.duration(data.ttl) + '\r\n';
            g += 'X-PUBLISHED-TTL:' + tools.duration(data.ttl) + '\r\n';
        }

        // Events
        data.events.forEach(function(event) {
            g += event.generate(calendar);
        });

        g += 'END:VCALENDAR';

        g = tools.foldLines(g);
        return g;
    };


    /**
     * Set your feed's domain…
     *
     * @param domain Domain
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.setDomain = function(domain) {
        this.domain(domain);
        return this;
    };


    /**
     * Set/Get your feed's domain…
     *
     * @param [domain] Domain
     * @since 0.2.0
     * @returns {ICalCalendar|String}
     */
    this.domain = function(domain) {
        if(!domain) {
            return data.domain;
        }

        data.domain = domain.toString();
        return this;
    };


    /**
     * Set your feed's prodid. Can be either a string like
     * "//sebbo.net//ical-generator//EN" or an object like
     * {
	 *   "company": "sebbo.net",
	 *   "product": "ical-generator"
	 *   "language": "EN"
	 * }
     *
     * `language` is optional and defaults to `EN`.
     *
     * @param prodid ProdID
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.setProdID = function(prodid) {
        if(!prodid || typeof prodid !== 'object') {
            throw '`prodid` is not an object!';
        }

        // update errors to 0.1.x version
        try {
            this.prodId(prodid);
        }
        catch(err) {
            throw err.replace(/`([\w.]+)`/i, 'event.$1');
        }

        return this;
    };


    /**
     * Set/Get your feed's prodid. `prodid` can be either a
     * string like "//sebbo.net//ical-generator//EN" or an
     * object like
     * {
     *   "company": "sebbo.net",
     *   "product": "ical-generator"
     *   "language": "EN"
     * }
     *
     * `language` is optional and defaults to `EN`.
     *
     * @param [prodid] ProdID
     * @since 0.2.0
     * @returns {ICalCalendar}
     */
    this.prodId = function(prodid) {
        if(!prodid) {
            return data.prodid;
        }

        var prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/,
            language;

        if(typeof prodid === 'string' && prodIdRegEx.test(prodid)) {
            data.prodid = prodid;
            return this;
        }
        if(typeof prodid === 'string') {
            throw '`prodid` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#prodidstringobject-prodid';
        }

        if(typeof prodid !== 'object') {
            throw '`prodid` needs to be a valid formed string or an object!';
        }

        if(!prodid.company) {
            throw '`prodid.company` is a mandatory item!';
        }
        if(!prodid.product) {
            throw '`prodid.product` is a mandatory item!';
        }

        language = (prodid.language || 'EN').toUpperCase();
        data.prodid = '//' + prodid.company + '//' + prodid.product + '//' + language;
        return this;
    };


    /**
     * Set/Get your feed's method
     *
     * @param {String} method
     * @since 0.2.8
     * @returns {ICalCalendar|String}
     */
    this.method = function(method) {
        if(method === undefined) {
            return data.method;
        }
        if(!method) {
            data.method = null;
            return this;
        }

        if(vars.allowedMethods.indexOf(method.toUpperCase()) === -1) {
            throw '`method` must be one of the following: ' + vars.allowedMethods.join(', ') + '!';
        }

        data.method = method.toUpperCase();
        return this;
    };


    /**
     * Set your feed's name…
     *
     * @param name Name
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.setName = function(name) {
        this.name(name);
        return this;
    };


    /**
     * Set/Get your feed's name…
     *
     * @param [name] Name
     * @since 0.2.0
     * @returns {ICalCalendar}
     */
    this.name = function(name) {
        if(name === undefined) {
            return data.name;
        }

        data.name = name ? name.toString() : null;
        return this;
    };


    /**
     * Set/Get your feed's description…
     *
     * @param [description] Description
     * @since 0.2.7
     * @returns {ICalCalendar}
     */
    this.description = function(description) {
        if(description === undefined) {
            return data.description;
        }

        data.description = description ? description.toString() : null;
        return this;
    };


    /**
     * Set your feed's timezone.
     * Used to set `X-WR-TIMEZONE`.
     *
     * @param timezone Timezone
     * @example cal.setTZ('America/New_York');
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.setTZ = function(timezone) {
        this.timezone(timezone);
        return this;
    };


    /**
     * Set/Get your feed's timezone.
     * Used to set `X-WR-TIMEZONE`.
     *
     * @param [timezone] Timezone
     * @example cal.timezone('America/New_York');
     * @since 0.2.0
     * @returns {ICalCalendar}
     */
    this.timezone = function(timezone) {
        if(timezone === undefined) {
            return data.timezone;
        }

        data.timezone = timezone ? timezone.toString() : null;
        return this;
    };


    /**
     * Set/Get your feed's URL
     *
     * @param [url] URL
     * @example cal.url('http://example.com/my/feed.ical');
     * @since 0.2.5
     * @returns {ICalCalendar}
     */
    this.url = function(url) {
        if(url === undefined) {
            return data.url;
        }

        data.url = url || null;
        return this;
    };


    /**
     * Set/Get your feed's TTL.
     * Used to set `X-PUBLISHED-TTL` and `REFRESH-INTERVAL`.
     *
     * @param [ttl] TTL
     * @example cal.ttl(60 * 60 * 24); // 1 day
     * @since 0.2.5
     * @returns {ICalCalendar}
     */
    this.ttl = function(ttl) {
        if(ttl === undefined) {
            return data.ttl;
        }

        data.ttl = parseInt(ttl, 10) || null;
        return this;
    };


    /**
     * Create a new Event and return the calendar object…
     *
     * @param option Event event
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.addEvent = function(event) {
        if(!event || typeof event !== 'object') {
            throw 'event is not an object!';
        }

        // validation: start
        if(!event.start) {
            throw 'event.start is a mandatory item!';
        }

        // validation: summary
        if(!event.summary) {
            throw 'event.summary is a mandatory item!';
        }


        var ICalEvent = __webpack_require__(1),
            e;

        // update errors to 0.1.x version
        try {
            e = new ICalEvent(event, this);
        }
        catch(err) {
            throw err.replace(/`([\w.]+)`/i, 'event.$1');
        }

        data.events.push(e);
        return this;
    };


    /**
     * Create a new Event and return the event object…
     *
     * @param [eventData] Event eventData
     * @since 0.2.0
     * @returns {ICalEvent}
     */
    this.createEvent = function(eventData) {
        var ICalEvent = __webpack_require__(1),
            event = new ICalEvent(eventData, this);

        data.events.push(event);
        return event;
    };


    /**
     * Get all events or add multiple events…
     *
     * @since 0.2.0
     * @returns {ICalEvent[]|ICalCalendar}
     */
    this.events = function(events) {
        if(!events) {
            return data.events;
        }

        var cal = this;
        events.forEach(function(e) {
            cal.createEvent(e);
        });
        return cal;
    };


    /**
     * Save ical file with `fs.save`
     *
     * @param path Filepath
     * @param [cb] Callback
     * @returns {ICalCalendar}
     */
    this.save = function(path, cb) {
        __webpack_require__(2).writeFile(path, generate(this), cb);
        return this;
    };


    /*jslint stupid: true */

    /**
     * Save ical file with `fs.saveSync`
     *
     * @param path Filepath
     * @returns Number Number of Bytes written
     */
    this.saveSync = function(path) {
        return __webpack_require__(2).writeFileSync(path, generate(this));
    };

    /*jslint stupid: false */


    /**
     * Save ical file with `fs.saveSync`
     *
     * @param {http.ServerResponse} response Response
     * @param String [filename] Filename
     * @returns Number Number of Bytes written
     */
    this.serve = function(response, filename) {
        response.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="' + (filename || 'calendar.ics') + '"'
        });
        response.end(generate(this));

        return this;
    };


    /**
     * Return ical as string…
     *
     * @returns String ical
     */
    this.toString = function() {
        return generate(this);
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = __webpack_require__(0);
        return tools.toJSON(this, attributes);
    };


    /**
     * Get number of events in calendar…
     *
     * @returns Number Number of events in calendar
     */
    this.length = function() {
        return data.events.length;
    };


    /**
     * Reset calendar to default state…
     *
     * @returns {ICalCalendar}
     */
    this.clear = function() {
        data.domain = __webpack_require__(8).hostname();
        data.prodid = '//sebbo.net//ical-generator//EN';
        data.method = null;
        data.name = null;
        data.timezone = null;
        data.ttl = null;
        data.url = null;

        data.events = [];
        return this;
    };


    /**
     * Deprecated method, does nothing…
     *
     * @deprecated since 0.2.0
     * @returns {ICalCalendar}
     */
    this.generate = function() {
        return this;
    };


    if(typeof _data === 'string') {
        _data = JSON.parse(_data);
    }

    this.clear();
    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalCalendar;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * @author Sebastian Pekarek
 * @module attendee
 * @constructor ICalAttendee Attendee
 */
var ICalAttendee = function(_data, event) {
    var attributes = ['name', 'email', 'role', 'status', 'type', 'delegatedTo', 'delegatedFrom', 'delegatesFrom', 'delegatesTo'],
        vars,
        i,
        data;

    if(!event) {
        throw '`event` option required!';
    }

    vars = {
        allowed: {
            role: ['REQ-PARTICIPANT', 'NON-PARTICIPANT'],
            status: ['ACCEPTED', 'TENTATIVE', 'DECLINED', 'DELEGATED'],
            type: ['INDIVIDUAL', 'GROUP', 'RESOURCE', 'ROOM', 'UNKNOWN'] // ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
        }
    };

    data = {
        name: null,
        email: null,
        status: null,
        role: 'REQ-PARTICIPANT',
        type: null,
        delegatedTo: null,
        delegatedFrom: null
    };


    function getAllowedRole(str) {
        return getAllowedStringFor('role', str);
    }

    function getAllowedStatus(str) {
        return getAllowedStringFor('status', str);
    }

    function getAllowedType(str) {
        return getAllowedStringFor('type', str);
    }

    function getAllowedStringFor(type, str) {
        if(!str || typeof(str) !== 'string') {
            throw new Error('Input for `' + type + '` must be a non-empty string. You gave ' + str);
        }

        str = str.toUpperCase();

        if(vars.allowed[type].indexOf(str) === -1) {
            throw new Error('`' + type + '` must be one of the following: ' + vars.allowed[type].join(', ') + '!');
        }

        return str;
    }


    /**
     * Set/Get the attendee's name
     *
     * @param name Name
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.name = function(name) {
        if(name === undefined) {
            return data.name;
        }

        data.name = name || null;
        return this;
    };


    /**
     * Set/Get the attendee's email address
     *
     * @param email Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.email = function(email) {
        if(!email) {
            return data.email;
        }

        data.email = email;
        return this;
    };


    /**
     * Set/Get attendee's role
     *
     * @param {String} role
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.role = function(role) {
        if(role === undefined) {
            return data.role;
        }

        data.role = getAllowedRole(role);
        return this;
    };


    /**
     * Set/Get attendee's status
     *
     * @param {String} status
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.status = function(status) {
        if(status === undefined) {
            return data.status;
        }
        if(!status) {
            data.status = null;
            return this;
        }

        data.status = getAllowedStatus(status);
        return this;
    };


    /**
     * Set/Get attendee's type (a.k.a. CUTYPE)
     *
     * @param {String} type
     * @since 0.2.3
     * @returns {ICalAttendee|String}
     */
    this.type = function(type) {
        if(type === undefined) {
            return data.type;
        }
        if(!type) {
            data.type = null;
            return this;
        }
        data.type = getAllowedType(type);
        return this;
    };


    /**
     * Set/Get the attendee's delegated-to field
     *
     * @param delegatedTo Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.delegatedTo = function(delegatedTo) {
        if(delegatedTo === undefined) {
            return data.delegatedTo;
        }
        if(!delegatedTo) {
            data.delegatedTo = null;
            if(data.status === 'DELEGATED') {
                data.status = null;
            }
            return this;
        }

        data.delegatedTo = delegatedTo;
        data.status = 'DELEGATED';
        return this;
    };


    /**
     * Set/Get the attendee's delegated-from field
     *
     * @param delegatedFrom Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.delegatedFrom = function(delegatedFrom) {
        if(delegatedFrom === undefined) {
            return data.delegatedFrom;
        }

        data.delegatedFrom = delegatedFrom || null;
        return this;
    };


    /**
     * Create a new attendee this attendee delegates to
     * and returns this new attendee
     *
     * @param {Object} options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.delegatesTo = function(options) {
        var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    };


    /**
     * Create a new attendee this attendee delegates from
     * and returns this new attendee
     *
     * @param {Object} options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.delegatesFrom = function(options) {
        var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = __webpack_require__(0);
        return tools.toJSON(this, attributes, {
            ignoreAttributes: ['delegatesTo', 'delegatesFrom'],
            hooks: {
                delegatedTo: function(value) {
                    return (value instanceof ICalAttendee ? value.email() : value);
                },
                delegatedFrom: function(value) {
                    return (value instanceof ICalAttendee ? value.email() : value);
                }
            }
        });
    };


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    this.generate = function() {
        var g = 'ATTENDEE';

        if(!data.email) {
            throw 'No value for `email` in ICalAttendee given!';
        }

        // ROLE
        g += ';ROLE=' + data.role;

        // TYPE
        if(data.type) {
            g += ';CUTYPE=' + data.type;
        }

        // PARTSTAT
        if(data.status) {
            g += ';PARTSTAT=' + data.status;
        }

        // DELEGATED-TO
        if(data.delegatedTo) {
            g += ';DELEGATED-TO="' + (data.delegatedTo instanceof ICalAttendee ? data.delegatedTo.email() : data.delegatedTo) + '"';
        }

        // DELEGATED-FROM
        if(data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + (data.delegatedFrom instanceof ICalAttendee ? data.delegatedFrom.email() : data.delegatedFrom) + '"';
        }

        // CN / Name
        if(data.name) {
            g += ';CN="' + data.name + '"';
        }

        g += ':MAILTO:' + data.email + '\r\n';
        return g;
    };


    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalAttendee;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * @author Sebastian Pekarek
 * @module alarm
 * @constructor ICalAlarm Alarm
 */
var ICalAlarm = function(_data, event) {
    var attributes = ['type', 'trigger', 'triggerBefore', 'triggerAfter', 'repeat', 'interval', 'attach', 'description'],
        vars,
        i,
        data;

    if(!event) {
        throw '`event` option required!';
    }

    vars = {
        types: ['display', 'audio']
    };

    data = {
        type: null,
        trigger: null,
        repeat: null,
        repeatInterval: null,
        attach: null,
        description: null
    };


    /**
     * Set/Get the alarm type
     *
     * @param type Type
     * @since 0.2.1
     * @returns {ICalAlarm|String}
     */
    this.type = function(type) {
        if(type === undefined) {
            return data.type;
        }
        if(!type) {
            data.type = null;
            return this;
        }

        if(vars.types.indexOf(type) === -1) {
            throw '`type` is not correct, must be either `display` or `audio`!';
        }

        data.type = type;
        return this;
    };


    /**
     * Set/Get seconds before event to trigger alarm
     *
     * @param {Number|Date} trigger Seconds before alarm triggeres
     * @since 0.2.1
     * @returns {ICalAlarm|Number|Date}
     */
    this.trigger = function(trigger) {
        if(trigger === undefined && data.trigger instanceof Date) {
            return data.trigger;
        }
        if(trigger === undefined && data.trigger) {
            return -1 * data.trigger;
        }
        if(trigger === undefined) {
            return null;
        }


        if(!trigger) {
            data.trigger = null;
            return this;
        }
        if(trigger instanceof Date) {
            data.trigger = trigger;
            return this;
        }
        if(typeof trigger === 'number' && isFinite(trigger)) {
            data.trigger = -1 * trigger;
            return this;
        }

        throw '`trigger` is not correct, must be either typeof `Number` or `Date`!';
    };


    /**
     * Set/Get seconds after event to trigger alarm
     *
     * @param {Number|Date} trigger Seconds after alarm triggeres
     * @since 0.2.1
     * @returns {ICalAlarm|Number|Date}
     */
    this.triggerAfter = function(trigger) {
        if(trigger === undefined) {
            return data.trigger;
        }

        return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
    };

    /**
     * Set/Get seconds before event to trigger alarm
     *
     * @param {Number|Date} trigger Seconds before alarm triggeres
     * @since 0.2.1
     * @alias trigger
     * @returns {ICalAlarm|Number|Date}
     */
    this.triggerBefore = this.trigger;


    /**
     * Set/Get Alarm Repetitions
     *
     * @param {Number} Number of repetitions
     * @since 0.2.1
     * @returns {ICalAlarm|Number}
     */
    this.repeat = function(repeat) {
        if(repeat === undefined) {
            return data.repeat;
        }
        if(!repeat) {
            data.repeat = null;
            return this;
        }

        if(typeof repeat !== 'number' || !isFinite(repeat)) {
            throw '`repeat` is not correct, must be numeric!';
        }

        data.repeat = repeat;
        return this;
    };


    /**
     * Set/Get Repeat Interval
     *
     * @param {Number} Interval in seconds
     * @since 0.2.1
     * @returns {ICalAlarm|Number|Null}
     */
    this.interval = function(interval) {
        if(interval === undefined) {
            return data.interval;
        }
        if(!interval) {
            data.interval = null;
            return this;
        }

        if(typeof interval !== 'number' || !isFinite(interval)) {
            throw '`interval` is not correct, must be numeric!';
        }

        data.interval = interval;
        return this;
    };


    /**
     * Set/Get Attachment
     *
     * @param {Object|String} File-URI or Object
     * @since 0.2.1
     * @returns {ICalAlarm|Object}
     */
    this.attach = function(_attach) {
        if(_attach === undefined) {
            return data.attach;
        }
        if(!_attach) {
            data.attach = null;
            return this;
        }

        var attach = null;
        if(typeof _attach === 'string') {
            attach = {
                uri: _attach,
                mime: null
            };
        }
        else if(typeof _attach === 'object') {
            attach = {
                uri: _attach.uri,
                mime: _attach.mime || null
            };
        }
        else {
            throw '`attach` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#attachstringobject-attach';
        }

        if(!attach.uri) {
            throw '`attach.uri` is empty!';
        }

        data.attach = {
            uri: attach.uri,
            mime: attach.mime
        };
        return this;
    };


    /**
     * Set/Get the alarm description
     *
     * @param description Description
     * @since 0.2.1
     * @returns {ICalAlarm|String}
     */
    this.description = function(description) {
        if(description === undefined) {
            return data.description;
        }
        if(!description) {
            data.description = null;
            return this;
        }

        data.description = description;
        return this;
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = __webpack_require__(0);
        return tools.toJSON(this, attributes);
    };


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    this.generate = function() {
        var tools = __webpack_require__(0),
            g = 'BEGIN:VALARM\r\n';

        if(!data.type) {
            throw 'No value for `type` in ICalAlarm given!';
        }
        if(!data.trigger) {
            throw 'No value for `trigger` in ICalAlarm given!';
        }

        // ACTION
        g += 'ACTION:' + data.type.toUpperCase() + '\r\n';

        if(data.trigger instanceof Date) {
            g += 'TRIGGER;VALUE=DATE-TIME:' + tools.formatDate(data.trigger) + '\r\n';
        }
        else if(data.trigger > 0) {
            g += 'TRIGGER;RELATED=END:' + tools.duration(data.trigger) + '\r\n';
        }
        else {
            g += 'TRIGGER:' + tools.duration(data.trigger) + '\r\n';
        }

        // REPEAT
        if(data.repeat && !data.interval) {
            throw 'No value for `interval` in ICalAlarm given, but required for `repeat`!';
        }
        if(data.repeat) {
            g += 'REPEAT:' + data.repeat + '\r\n';
        }

        // INTERVAL
        if(data.interval && !data.repeat) {
            throw 'No value for `repeat` in ICalAlarm given, but required for `interval`!';
        }
        if(data.interval) {
            g += 'DURATION:' + tools.duration(data.interval) + '\r\n';
        }

        // ATTACH
        if(data.type === 'audio' && data.attach && data.attach.mime) {
            g += 'ATTACH;FMTTYPE=' + data.attach.mime + ':' + data.attach.uri + '\r\n';
        }
        else if(data.type === 'audio' && data.attach) {
            g += 'ATTACH;VALUE=URI:' + data.attach.uri + '\r\n';
        }
        else if(data.type === 'audio') {
            g += 'ATTACH;VALUE=URI:Basso\r\n';
        }

        // DESCRIPTION
        if(data.type === 'display' && data.description) {
            g += 'DESCRIPTION:' + tools.escape(data.description) + '\r\n';
        }
        else if(data.type === 'display') {
            g += 'DESCRIPTION:' + tools.escape(event.summary()) + '\r\n';
        }

        g += 'END:VALARM\r\n';
        return g;
    };


    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalAlarm;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';


/***/ })
/******/ ]);