const page_title = document.querySelector('div.pagetitlediv h2')
const MS_PER_DAY = 86400000

if (page_title.textContent == 'View detailed timetable') {
  const calendar_title = 'UVic Schedule: ' + document.querySelector('div.staticheaders').childNodes[2].textContent.split(': ')[1]
  const class_section_list = document.querySelectorAll('div#P_CrseSchdDetl > table.datadisplaytable')
  let class_objects = []
  class_section_list.forEach(class_selection => {
    let info_table = class_selection.querySelector('table.datadisplaytable.tablesorter > tbody > tbody')
    class_objects = class_objects.concat([...info_table.rows].map(row => { //row = [Type, Time, Days, Where, Date Range, Schedule Type, Instructors]

      let class_object             = {floating: true}
      class_object.summary         = class_selection.querySelector('caption').textContent
      const [start_date, end_date] = row.cells[4].textContent.split('-').map(el => el.trim())
      const first_day_in_range     = new Date(start_date).getDay()
      let first_occurrance_order   = []

      for (let i = 0; i < 7; i++) {
        first_occurrance_order.push((first_day_in_range + i) % 7)
      }
      // If the first day of the date range is a wednesday => [3,4,5,6,0,1,2]

      const days_raw = row.cells[2].textContent // some combination of: m t w r f
      let days       = []

      for (let i = 0; i < days_raw.length; i++) {
        days.push(dayCharToInt(days_raw[i]))
      }
      // mwr => [1,3,4]



      const first_occurrance_offset = Math.min(...days.map(day=>first_occurrance_order.indexOf(day)))
      // Find the first day of a class to create the inital calendar event. If semester starts on a tues and class is every monday wednesday and thurs, find that first wednesday.

      let [start_time, end_time] = row.cells[1].textContent.split('-').map(el => to24(el.trim())) // Time of day class occurs
      start_time = new Date(start_date + ' ' + start_time) //DateTime of First day in range at time of class start
      end_time = new Date(start_date + ' ' + end_time)

      class_object.location = row.cells[3].textContent
      // Start event offset from the beginning of the range to the actual first occurrance of the class.
      class_object.start    = new Date(start_time.setTime(start_time.getTime() + (first_occurrance_offset * MS_PER_DAY)))
      class_object.end      = new Date(end_time.setTime(end_time.getTime() + (first_occurrance_offset * MS_PER_DAY)))

      if (start_date != end_date) { //Some classes have many rows of ranges of a single day.
        class_object.repeating = {
          freq: 'WEEKLY',
          until: new Date(end_date),
        }
        if (days.length > 1) { //To prevent timezone weirdness for late classes avoid setting byday if not needed.
          class_object.repeating.byDay = []
          days.forEach((day) => {
            class_object.repeating.byDay.push(dayIntToRRULE(day))
          })
        }
      }
      return class_object
    }))
  })
  console.log(class_objects)


  let cal = require('ical-generator')({
    name:     calendar_title,
    prodId:   '//m20n.com//UVICalendar//EN',
    timezone: 'America/Vancouver',
    events:   class_objects
  })

  let export_button         = document.createElement('a')
  export_button.textContent = 'export'
  export_button.href        = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(cal.toString())
  export_button.download    = calendar_title + '.calendar'
  export_button.id          = 'uvical_export'
  let header_links          = document.querySelector('span.pageheaderlinks')

  // During dev reloading extension caused multiple buttons to be added
  let old_button            = header_links.querySelector('#uvical_export')
  if (old_button) { header_links.removeChild(old_button) }

  header_links.insertBefore(export_button, header_links.firstChild)
}

function to24(time) {
  let [hours, minutes] = time.split(':').map(el=>parseInt(el,10))
  if (time.endsWith('pm') && hours !== 12) {
    hours += 12
  }
  return hours.toString()+':'+ (minutes == 0?'00':minutes.toString())
}

function dayCharToInt(dayChar) {
  const days = ['su','m','t','w','r','f','sa']
  return days.indexOf(dayChar.toLowerCase())
}

function dayIntToRRULE(dayInt) {
  const days = ['su','mo', 'tu', 'we', 'th', 'fr', 'sa']
  return days[dayInt]
}
