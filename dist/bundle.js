!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=3)}([function(t,e,n){"use strict";t.exports={},t.exports.formatDate=function(t,e,n){function r(t){return(t<10?"0":"")+t}var i;return i=t.getUTCFullYear(),i+=r(t.getUTCMonth()+1),i+=r(t.getUTCDate()),e||(i+="T",i+=r(t.getUTCHours()),i+=r(t.getUTCMinutes()),i+=r(t.getUTCSeconds()),n||(i+="Z")),i},t.exports.formatDateTZ=function(e,n,r){var i="",o=r.floating;return r.timezone&&(i=";TZID="+r.timezone,o=!0),e+i+":"+t.exports.formatDate(n,!1,o)},t.exports.escape=function(t){return t.replace(/[\\;,"]/g,function(t){return"\\"+t}).replace(/(?:\r\n|\r|\n)/g,"\\n")},t.exports.duration=function(t){var e="";return t<0&&(e="-",t*=-1),e+="P",t>=86400&&(e+=Math.floor(t/86400)+"D",t%=86400),!t&&e.length>1?e:(e+="T",t>=3600&&(e+=Math.floor(t/3600)+"H",t%=3600),t>=60&&(e+=Math.floor(t/60)+"M",t%=60),t>0?e+=t+"S":e.length<=2&&(e+="0S"),e)},t.exports.toJSON=function(t,e,n){var r={};return n=n||{},n.ignoreAttributes=n.ignoreAttributes||[],n.hooks=n.hooks||{},e.forEach(function(e){if(-1===n.ignoreAttributes.indexOf(e)){var i,o=t[e]();n.hooks[e]&&(o=n.hooks[e](o)),o&&(r[e]=o,Array.isArray(r[e])&&(i=[],r[e].forEach(function(t){i.push(t.toJSON())}),r[e]=i))}}),r},t.exports.foldLines=function(t){return t.split("\r\n").map(function(t){return t.match(/(.{1,74})/g).join("\r\n ")}).join("\r\n")}},function(t,e,n){"use strict";t.exports=function(t,e){var r,i,o,a=["id","uid","sequence","start","end","timezone","stamp","timestamp","allDay","floating","repeating","summary","location","description","organizer","attendees","alarms","method","status","url"];if(!e)throw"`calendar` option required!";r={allowedRepeatingFreq:["SECONDLY","MINUTELY","HOURLY","DAILY","WEEKLY","MONTHLY","YEARLY"],allowedStatuses:["CONFIRMED","TENTATIVE","CANCELLED"]},o={id:("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).substr(-4),sequence:0,start:null,end:null,timezone:void 0,stamp:new Date,allDay:!1,floating:!1,repeating:null,summary:"",location:null,description:null,htmlDescription:null,organizer:null,attendees:[],alarms:[],status:null,url:null},this.id=function(t){return t?(o.id=t,this):o.id},this.uid=this.id,this.sequence=function(t){if(void 0===t)return o.sequence;var e=parseInt(t,10);if(isNaN(e))throw"`sequence` must be a number!";return o.sequence=e,this},this.start=function(t){if(!t)return o.start;if("string"==typeof t&&(t=new Date(t)),!(t instanceof Date)||isNaN(t.getTime()))throw"`start` must be a Date Object!";if(o.start=t,o.start&&o.end&&o.start>o.end){var e=o.start;o.start=o.end,o.end=e}return this},this.end=function(t){if(void 0===t)return o.end;if(!t)return o.end=null,this;if("string"==typeof t&&(t=new Date(t)),!(t instanceof Date)||isNaN(t.getTime()))throw"`end` must be a Date Object!";if(o.end=t,o.start&&o.end&&o.start>o.end){var e=o.start;o.start=o.end,o.end=e}return this},this.timezone=function(t){return void 0===t&&void 0!==o.timezone?o.timezone:void 0===t?e.timezone():(o.timezone=t?t.toString():null,o.timezone&&(o.floating=!1),this)},this.stamp=function(t){if(!t)return o.stamp;if("string"==typeof t&&(t=new Date(t)),!(t instanceof Date)||isNaN(t.getTime()))throw"`stamp` must be a Date Object!";return o.stamp=t,this},this.timestamp=this.stamp,this.allDay=function(t){return void 0===t?o.allDay:(o.allDay=!!t,this)},this.floating=function(t){return void 0===t?o.floating:(o.floating=!!t,o.floating&&(o.timezone=null),this)},this.repeating=function(t){if(void 0===t)return o.repeating;if(!t)return o.repeating=null,this;if(!t.freq||-1===r.allowedRepeatingFreq.indexOf(t.freq.toUpperCase()))throw"`repeating.freq` is a mandatory item, and must be one of the following: "+r.allowedRepeatingFreq.join(", ")+"!";if(o.repeating={freq:t.freq.toUpperCase()},t.count){if(!isFinite(t.count))throw"`repeating.count` must be a Number!";o.repeating.count=t.count}if(t.interval){if(!isFinite(t.interval))throw"`repeating.interval` must be a Number!";o.repeating.interval=t.interval}if(t.until){if("string"==typeof t.until&&(t.until=new Date(t.until)),!(t.until instanceof Date)||isNaN(t.until.getTime()))throw"`repeating.until` must be a Date Object!";o.repeating.until=t.until}return t.byDay&&(Array.isArray(t.byDay)||(t.byDay=[t.byDay]),o.repeating.byDay=[],t.byDay.forEach(function(t){var e=t.toString().toUpperCase().match(/^(\d*||-\d+)(\w+)$/);if(-1===["SU","MO","TU","WE","TH","FR","SA"].indexOf(e[2]))throw"`repeating.byDay` contains invalid value `"+e[2]+"`!";o.repeating.byDay.push(e[1]+e[2])})),t.byMonth&&(Array.isArray(t.byMonth)||(t.byMonth=[t.byMonth]),o.repeating.byMonth=[],t.byMonth.forEach(function(t){if("number"!=typeof t||t<1||t>12)throw"`repeating.byMonth` contains invalid value `"+t+"`!";o.repeating.byMonth.push(t)})),t.byMonthDay&&(Array.isArray(t.byMonthDay)||(t.byMonthDay=[t.byMonthDay]),o.repeating.byMonthDay=[],t.byMonthDay.forEach(function(t){if("number"!=typeof t||t<1||t>31)throw"`repeating.byMonthDay` contains invalid value `"+t+"`!";o.repeating.byMonthDay.push(t)})),t.exclude&&(Array.isArray(t.exclude)||(t.exclude=[t.exclude]),o.repeating.exclude=[],t.exclude.forEach(function(t){var e=t;if("string"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw"`repeating.exclude` contains invalid value `"+e+"`!";o.repeating.exclude.push(t)})),this},this.summary=function(t){return void 0===t?o.summary:(o.summary=t?t.toString():"",this)},this.location=function(t){return void 0===t?o.location:(o.location=t?t.toString():null,this)},this.description=function(t){return void 0===t?o.description:(o.description=t?t.toString():null,this)},this.htmlDescription=function(t){return void 0===t?o.htmlDescription:(o.htmlDescription=t?t.toString():null,this)},this.organizer=function(t){if(void 0===t)return o.organizer;if(!t)return o.organizer=null,this;var e=null;if("string"==typeof t&&/^(.+) ?<([^>]+)>$/.test(t))e={name:RegExp.$1.trim(),email:RegExp.$2};else{if("object"!=typeof t)throw"string"==typeof t?"`organizer` isn't formated correctly. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer":"`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer";e={name:t.name,email:t.email}}if(!e.name)throw"`organizer.name` is empty!";if(!e.email)throw"`organizer.email` is empty!";return o.organizer={name:e.name,email:e.email},this},this.createAttendee=function(t){var e,r=n(6);if("string"==typeof t&&/^(.+) ?<([^>]+)>$/.test(t))return e=new r({name:RegExp.$1.trim(),email:RegExp.$2},this),o.attendees.push(e),e;if("string"==typeof t)throw"`attendee` isn't formated correctly. See https://github.com/sebbo2002/ical-generator#createattendeeobject-options";return e=new r(t,this),o.attendees.push(e),e},this.attendees=function(t){if(!t)return o.attendees;var e=this;return t.forEach(function(t){e.createAttendee(t)}),e},this.createAlarm=function(t){var e=new(n(7))(t,this);return o.alarms.push(e),e},this.alarms=function(t){if(!t)return o.alarms;var e=this;return t.forEach(function(t){e.createAlarm(t)}),e},this.method=function(t){return void 0===t?e.method():t?(e.method(t),this):(e.method(null),this)},this.status=function(t){if(void 0===t)return o.status;if(!t)return o.status=null,this;if("TENATIVE"===t&&(t="TENTATIVE"),-1===r.allowedStatuses.indexOf(t.toUpperCase()))throw"`status` must be one of the following: "+r.allowedStatuses.join(", ")+"!";return o.status=t.toUpperCase(),this},this.url=function(t){return void 0===t?o.url:(o.url=t?t.toString():null,this)},this.toJSON=function(){return n(0).toJSON(this,a)},this.generate=function(t){var e=n(0),r="";if(!t)throw"`calendar` option required!";if(!o.start)throw"No value for `start` in ICalEvent #"+o.id+" given!";if(o.timezone&&(o.floating=!1),r+="BEGIN:VEVENT\r\n",r+="UID:"+o.id+"@"+t.domain()+"\r\n",r+="SEQUENCE:"+o.sequence+"\r\n",r+="DTSTAMP:"+e.formatDate(o.stamp)+"\r\n",o.allDay?(r+="DTSTART;VALUE=DATE:"+e.formatDate(o.start,!0)+"\r\n",o.end&&(r+="DTEND;VALUE=DATE:"+e.formatDate(o.end,!0)+"\r\n"),r+="X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n",r+="X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n"):(r+=e.formatDateTZ("DTSTART",o.start,o)+"\r\n",o.end&&(r+=e.formatDateTZ("DTEND",o.end,o)+"\r\n")),o.repeating&&(r+="RRULE:FREQ="+o.repeating.freq,o.repeating.count&&(r+=";COUNT="+o.repeating.count),o.repeating.interval&&(r+=";INTERVAL="+o.repeating.interval),o.repeating.until&&(r+=";UNTIL="+e.formatDate(o.repeating.until)),o.repeating.byDay&&(r+=";BYDAY="+o.repeating.byDay.join(",")),o.repeating.byMonth&&(r+=";BYMONTH="+o.repeating.byMonth.join(",")),o.repeating.byMonthDay&&(r+=";BYMONTHDAY="+o.repeating.byMonthDay.join(",")),r+="\r\n",o.repeating.exclude)){r+="EXDATE:";var i=[];o.repeating.exclude.forEach(function(t){i.push(e.formatDate(t))}),r+=i.join(","),r+="\r\n"}return r+="SUMMARY:"+e.escape(o.summary)+"\r\n",o.location&&(r+="LOCATION:"+e.escape(o.location)+"\r\n"),o.description&&(r+="DESCRIPTION:"+e.escape(o.description)+"\r\n"),o.htmlDescription&&(r+="X-ALT-DESC;FMTTYPE=text/html:"+e.escape(o.htmlDescription)+"\r\n"),o.organizer&&(r+='ORGANIZER;CN="'+e.escape(o.organizer.name)+'":mailto:'+e.escape(o.organizer.email)+"\r\n"),o.attendees.forEach(function(t){r+=t.generate()}),o.alarms.forEach(function(t){r+=t.generate()}),o.url&&(r+="URL;VALUE=URI:"+e.escape(o.url)+"\r\n"),o.status&&(r+="STATUS:"+o.status.toUpperCase()+"\r\n"),r+="END:VEVENT\r\n"};for(i in t)t.hasOwnProperty(i)&&a.indexOf(i)>-1&&this[i](t[i])}},function(t,e){},function(t,e,n){function r(t){let[e,n]=t.split(":").map(t=>parseInt(t));return t.endsWith("pm")&&(e+=12),e.toString()+":"+(0==n?"00":n.toString())}function i(t){switch(t.toLowerCase()){case"m":return 1;case"t":return 2;case"w":return 3;case"r":return 4;case"f":return 5}}function o(t){switch(t){case 1:return"mo";case 2:return"tu";case 3:return"we";case 4:return"th";case 5:return"fr"}}if("View detailed timetable"==document.querySelector("div.pagetitlediv h2").textContent){const t="UVic Schedule: "+document.querySelector("div.staticheaders").childNodes[2].textContent.split(": ")[1];let e=[];document.querySelectorAll("div#P_CrseSchdDetl > table.datadisplaytable").forEach(t=>{let n=t.querySelector("table.datadisplaytable.tablesorter > tbody > tbody");Array.from(n.rows).forEach(n=>{let a={};a.summary=t.querySelector("caption").textContent;const[s,u]=n.cells[4].textContent.split("-").map(t=>t.trim()),l=new Date(s).getDay();let c=[];for(let t=0;t<7;t++)c.push((l+t)%7);const f=n.cells[2].textContent;let h=[];for(let t=0;t<f.length;t++)h.push(i(f[t]));const d=Math.min(...h.map(t=>c.indexOf(t)));let[p,m]=n.cells[1].textContent.split("-").map(t=>r(t.trim()));p=new Date(s+" "+p),m=new Date(s+" "+m),a.location=n.cells[3].textContent,a.start=new Date(p.setTime(p.getTime()+864e5*d)),a.end=new Date(m.setTime(m.getTime()+864e5*d)),s!=u&&(a.repeating={freq:"WEEKLY",until:new Date(u)},h.length>1&&(a.repeating.byDay=[],h.forEach(t=>{a.repeating.byDay.push(o(t))}))),e.push(a)})});let a=n(4)({name:t,prodId:"//maxwellborden.com//UVICalendar//EN",timezone:"Americas/Vancouver",events:e}),s=document.createElement("a");s.textContent="export",s.href="data:text/calendar;charset=utf-8,"+encodeURIComponent(a.toString()),s.download=t+".calendar",s.id="uvical_export";let u=document.querySelector("span.pageheaderlinks"),l=u.querySelector("#uvical_export");l&&u.removeChild(l),u.insertBefore(s,u.firstChild)}},function(t,e,n){t.exports=function(t){"use strict";return new(n(5))(t)}},function(t,e,n){"use strict";t.exports=function(t){var e,r,i,o={},a=["domain","prodId","method","name","description","timezone","ttl","url","events"];e={allowedMethods:["PUBLISH","REQUEST","REPLY","ADD","CANCEL","REFRESH","COUNTER","DECLINECOUNTER"]},r=function(t){var e=n(0),r="";return r="BEGIN:VCALENDAR\r\nVERSION:2.0\r\n",r+="PRODID:-"+o.prodid+"\r\n",o.url&&(r+="URL:"+o.url+"\r\n"),o.method&&(r+="METHOD:"+o.method+"\r\n"),o.name&&(r+="NAME:"+o.name+"\r\n",r+="X-WR-CALNAME:"+o.name+"\r\n"),o.description&&(r+="X-WR-CALDESC:"+o.description+"\r\n"),o.timezone&&(r+="TIMEZONE-ID:"+o.timezone+"\r\n",r+="X-WR-TIMEZONE:"+o.timezone+"\r\n"),o.ttl&&(r+="REFRESH-INTERVAL;VALUE=DURATION:"+e.duration(o.ttl)+"\r\n",r+="X-PUBLISHED-TTL:"+e.duration(o.ttl)+"\r\n"),o.events.forEach(function(e){r+=e.generate(t)}),r+="END:VCALENDAR",r=e.foldLines(r)},this.setDomain=function(t){return this.domain(t),this},this.domain=function(t){return t?(o.domain=t.toString(),this):o.domain},this.setProdID=function(t){if(!t||"object"!=typeof t)throw"`prodid` is not an object!";try{this.prodId(t)}catch(t){throw t.replace(/`([\w.]+)`/i,"event.$1")}return this},this.prodId=function(t){if(!t)return o.prodid;var e;if("string"==typeof t&&/^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/.test(t))return o.prodid=t,this;if("string"==typeof t)throw"`prodid` isn't formated correctly. See https://github.com/sebbo2002/ical-generator#prodidstringobject-prodid";if("object"!=typeof t)throw"`prodid` needs to be a valid formed string or an object!";if(!t.company)throw"`prodid.company` is a mandatory item!";if(!t.product)throw"`prodid.product` is a mandatory item!";return e=(t.language||"EN").toUpperCase(),o.prodid="//"+t.company+"//"+t.product+"//"+e,this},this.method=function(t){if(void 0===t)return o.method;if(!t)return o.method=null,this;if(-1===e.allowedMethods.indexOf(t.toUpperCase()))throw"`method` must be one of the following: "+e.allowedMethods.join(", ")+"!";return o.method=t.toUpperCase(),this},this.setName=function(t){return this.name(t),this},this.name=function(t){return void 0===t?o.name:(o.name=t?t.toString():null,this)},this.description=function(t){return void 0===t?o.description:(o.description=t?t.toString():null,this)},this.setTZ=function(t){return this.timezone(t),this},this.timezone=function(t){return void 0===t?o.timezone:(o.timezone=t?t.toString():null,this)},this.url=function(t){return void 0===t?o.url:(o.url=t||null,this)},this.ttl=function(t){return void 0===t?o.ttl:(o.ttl=parseInt(t,10)||null,this)},this.addEvent=function(t){if(!t||"object"!=typeof t)throw"event is not an object!";if(!t.start)throw"event.start is a mandatory item!";if(!t.summary)throw"event.summary is a mandatory item!";var e,r=n(1);try{e=new r(t,this)}catch(t){throw t.replace(/`([\w.]+)`/i,"event.$1")}return o.events.push(e),this},this.createEvent=function(t){var e=new(n(1))(t,this);return o.events.push(e),e},this.events=function(t){if(!t)return o.events;var e=this;return t.forEach(function(t){e.createEvent(t)}),e},this.save=function(t,e){return n(2).writeFile(t,r(this),e),this},this.saveSync=function(t){return n(2).writeFileSync(t,r(this))},this.serve=function(t,e){return t.writeHead(200,{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'attachment; filename="'+(e||"calendar.ics")+'"'}),t.end(r(this)),this},this.toString=function(){return r(this)},this.toJSON=function(){return n(0).toJSON(this,a)},this.length=function(){return o.events.length},this.clear=function(){return o.domain=n(8).hostname(),o.prodid="//sebbo.net//ical-generator//EN",o.method=null,o.name=null,o.timezone=null,o.ttl=null,o.url=null,o.events=[],this},this.generate=function(){return this},"string"==typeof t&&(t=JSON.parse(t)),this.clear();for(i in t)t.hasOwnProperty(i)&&a.indexOf(i)>-1&&this[i](t[i])}},function(t,e,n){"use strict";var r=function(t,e){function i(t){return s("role",t)}function o(t){return s("status",t)}function a(t){return s("type",t)}function s(t,e){if(!e||"string"!=typeof e)throw new Error("Input for `"+t+"` must be a non-empty string. You gave "+e);if(e=e.toUpperCase(),-1===u.allowed[t].indexOf(e))throw new Error("`"+t+"` must be one of the following: "+u.allowed[t].join(", ")+"!");return e}var u,l,c,f=["name","email","role","status","type","delegatedTo","delegatedFrom","delegatesFrom","delegatesTo"];if(!e)throw"`event` option required!";u={allowed:{role:["REQ-PARTICIPANT","NON-PARTICIPANT"],status:["ACCEPTED","TENTATIVE","DECLINED","DELEGATED"],type:["INDIVIDUAL","GROUP","RESOURCE","ROOM","UNKNOWN"]}},c={name:null,email:null,status:null,role:"REQ-PARTICIPANT",type:null,delegatedTo:null,delegatedFrom:null},this.name=function(t){return void 0===t?c.name:(c.name=t||null,this)},this.email=function(t){return t?(c.email=t,this):c.email},this.role=function(t){return void 0===t?c.role:(c.role=i(t),this)},this.status=function(t){return void 0===t?c.status:t?(c.status=o(t),this):(c.status=null,this)},this.type=function(t){return void 0===t?c.type:t?(c.type=a(t),this):(c.type=null,this)},this.delegatedTo=function(t){return void 0===t?c.delegatedTo:t?(c.delegatedTo=t,c.status="DELEGATED",this):(c.delegatedTo=null,"DELEGATED"===c.status&&(c.status=null),this)},this.delegatedFrom=function(t){return void 0===t?c.delegatedFrom:(c.delegatedFrom=t||null,this)},this.delegatesTo=function(t){var n=t instanceof r?t:e.createAttendee(t);return this.delegatedTo(n),n.delegatedFrom(this),n},this.delegatesFrom=function(t){var n=t instanceof r?t:e.createAttendee(t);return this.delegatedFrom(n),n.delegatedTo(this),n},this.toJSON=function(){return n(0).toJSON(this,f,{ignoreAttributes:["delegatesTo","delegatesFrom"],hooks:{delegatedTo:function(t){return t instanceof r?t.email():t},delegatedFrom:function(t){return t instanceof r?t.email():t}}})},this.generate=function(){var t="ATTENDEE";if(!c.email)throw"No value for `email` in ICalAttendee given!";return t+=";ROLE="+c.role,c.type&&(t+=";CUTYPE="+c.type),c.status&&(t+=";PARTSTAT="+c.status),c.delegatedTo&&(t+=';DELEGATED-TO="'+(c.delegatedTo instanceof r?c.delegatedTo.email():c.delegatedTo)+'"'),c.delegatedFrom&&(t+=';DELEGATED-FROM="'+(c.delegatedFrom instanceof r?c.delegatedFrom.email():c.delegatedFrom)+'"'),c.name&&(t+=';CN="'+c.name+'"'),t+=":MAILTO:"+c.email+"\r\n"};for(l in t)t.hasOwnProperty(l)&&f.indexOf(l)>-1&&this[l](t[l])};t.exports=r},function(t,e,n){"use strict";t.exports=function(t,e){var r,i,o,a=["type","trigger","triggerBefore","triggerAfter","repeat","interval","attach","description"];if(!e)throw"`event` option required!";r={types:["display","audio"]},o={type:null,trigger:null,repeat:null,repeatInterval:null,attach:null,description:null},this.type=function(t){if(void 0===t)return o.type;if(!t)return o.type=null,this;if(-1===r.types.indexOf(t))throw"`type` is not correct, must be either `display` or `audio`!";return o.type=t,this},this.trigger=function(t){if(void 0===t&&o.trigger instanceof Date)return o.trigger;if(void 0===t&&o.trigger)return-1*o.trigger;if(void 0===t)return null;if(!t)return o.trigger=null,this;if(t instanceof Date)return o.trigger=t,this;if("number"==typeof t&&isFinite(t))return o.trigger=-1*t,this;throw"`trigger` is not correct, must be either typeof `Number` or `Date`!"},this.triggerAfter=function(t){return void 0===t?o.trigger:this.trigger("number"==typeof t?-1*t:t)},this.triggerBefore=this.trigger,this.repeat=function(t){if(void 0===t)return o.repeat;if(!t)return o.repeat=null,this;if("number"!=typeof t||!isFinite(t))throw"`repeat` is not correct, must be numeric!";return o.repeat=t,this},this.interval=function(t){if(void 0===t)return o.interval;if(!t)return o.interval=null,this;if("number"!=typeof t||!isFinite(t))throw"`interval` is not correct, must be numeric!";return o.interval=t,this},this.attach=function(t){if(void 0===t)return o.attach;if(!t)return o.attach=null,this;var e=null;if("string"==typeof t)e={uri:t,mime:null};else{if("object"!=typeof t)throw"`attach` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#attachstringobject-attach";e={uri:t.uri,mime:t.mime||null}}if(!e.uri)throw"`attach.uri` is empty!";return o.attach={uri:e.uri,mime:e.mime},this},this.description=function(t){return void 0===t?o.description:t?(o.description=t,this):(o.description=null,this)},this.toJSON=function(){return n(0).toJSON(this,a)},this.generate=function(){var t=n(0),r="BEGIN:VALARM\r\n";if(!o.type)throw"No value for `type` in ICalAlarm given!";if(!o.trigger)throw"No value for `trigger` in ICalAlarm given!";if(r+="ACTION:"+o.type.toUpperCase()+"\r\n",o.trigger instanceof Date?r+="TRIGGER;VALUE=DATE-TIME:"+t.formatDate(o.trigger)+"\r\n":o.trigger>0?r+="TRIGGER;RELATED=END:"+t.duration(o.trigger)+"\r\n":r+="TRIGGER:"+t.duration(o.trigger)+"\r\n",o.repeat&&!o.interval)throw"No value for `interval` in ICalAlarm given, but required for `repeat`!";if(o.repeat&&(r+="REPEAT:"+o.repeat+"\r\n"),o.interval&&!o.repeat)throw"No value for `repeat` in ICalAlarm given, but required for `interval`!";return o.interval&&(r+="DURATION:"+t.duration(o.interval)+"\r\n"),"audio"===o.type&&o.attach&&o.attach.mime?r+="ATTACH;FMTTYPE="+o.attach.mime+":"+o.attach.uri+"\r\n":"audio"===o.type&&o.attach?r+="ATTACH;VALUE=URI:"+o.attach.uri+"\r\n":"audio"===o.type&&(r+="ATTACH;VALUE=URI:Basso\r\n"),"display"===o.type&&o.description?r+="DESCRIPTION:"+t.escape(o.description)+"\r\n":"display"===o.type&&(r+="DESCRIPTION:"+t.escape(e.summary())+"\r\n"),r+="END:VALARM\r\n"};for(i in t)t.hasOwnProperty(i)&&a.indexOf(i)>-1&&this[i](t[i])}},function(t,e){e.endianness=function(){return"LE"},e.hostname=function(){return"undefined"!=typeof location?location.hostname:""},e.loadavg=function(){return[]},e.uptime=function(){return 0},e.freemem=function(){return Number.MAX_VALUE},e.totalmem=function(){return Number.MAX_VALUE},e.cpus=function(){return[]},e.type=function(){return"Browser"},e.release=function(){return"undefined"!=typeof navigator?navigator.appVersion:""},e.networkInterfaces=e.getNetworkInterfaces=function(){return{}},e.arch=function(){return"javascript"},e.platform=function(){return"browser"},e.tmpdir=e.tmpDir=function(){return"/tmp"},e.EOL="\n"}]);