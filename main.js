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
          class_object.repeating.byDay.push(dayIntToRRULE(day))
        })
      }
    }
    
    class_objects.push(class_object)
  })
  let cal = require('ical-generator')({name: calendar_title, prodId: '//maxwellborden.com//UVICalendar//EN', timezone: 'Americas/Vancouver', events: class_objects})

  let download_uri = document.createElement('a')
  download_uri.textContent = 'Download iCal'
  download_uri.download = calendar_title + '.calendar'
  download_uri.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cal.toString())
  modal.appendChild(download_uri)
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

function dayIntToRRULE(dayInt) {
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
