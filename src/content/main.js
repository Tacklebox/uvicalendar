import * as scrape from './scraping-methods.js'
import iCal from 'ical-generator'

const MS_PER_DAY = 86400000

if (scrape.onDetailedSchedulePage()) {
  const calendarTitle = 'UVic ' + scrape.getSemester()
  const classSections = scrape.getClassSections()

  let classes = []
  classSections.forEach(classSection => {
    const scheduledMeetingTimes = scrape.getScheduledMeetingTimes(classSection)
    classes = classes.concat(scheduledMeetingTimes.map(meetingTime => { //meetingTime = [Type, Time, Days, Where, Date Range, Schedule Type, Instructors]

      const floating = true
      const summary  = scrape.getClassSectionTitle(classSection)
      const location = meetingTime.cells[3].textContent

      const [startDate, endDate] = meetingTime.cells[4].textContent.split('-').map(el => el.trim())
      const firstDayInRange     = new Date(startDate).getDay()
      let firstOccurranceOrder   = []

      for (let i = 0; i < 7; i++) {
        firstOccurranceOrder.push((firstDayInRange + i) % 7)
      }
      // If the first day of the date range is a wednesday => [3,4,5,6,0,1,2]

      const days = meetingTime.cells[2].textContent // some combination of: m t w r f
        .split('')
        .map(dayCharToInt)
      // mwr => [1,3,4]

      const firstOccurranceOffset = Math.min(...days.map(day=>firstOccurranceOrder.indexOf(day))) * MS_PER_DAY
      // Find the first day of a class to create the inital calendar event. If semester starts on a tues and class is every monday wednesday and thurs, find that first wednesday.

      let [startTime, endTime] = meetingTime.cells[1].textContent.split('-').map(el => to24(el.trim())) // Time of day class occurs
      startTime = new Date(startDate + ' ' + startTime) //DateTime of First day in range at time of class start
      endTime = new Date(startDate + ' ' + endTime)

      // Start event offset from the beginning of the range to the actual first occurrance of the class.
      const start = new Date(startTime.setTime(startTime.getTime() + firstOccurranceOffset))
      const end   = new Date(endTime.setTime(endTime.getTime() + firstOccurranceOffset))

      //Some classes have many meetingTimes of ranges of a single day.
      const repeating = (startDate !== endDate) ?  {
        freq: 'WEEKLY',
        until: new Date(endDate),
        byDay: days.map(dayIntToRRULE)
      } : null
      return {start, end, summary, location, floating, repeating}
    }))
  })


  let calendar = iCal({
    name:     calendarTitle,
    prodId:   '//m20n.com//UVICalendar//EN',
    timezone: 'America/Vancouver',
    events:   classes
  })

  let exportLink = document.createElement('a')
  exportLink.textContent = 'export'
  exportLink.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(calendar.toString())}`
  exportLink.download = `${calendarTitle}.ics`
  exportLink.id = 'uvical_export'

  scrape.insertExportLink(exportLink)
}

function to24(time) {
  let [hours, minutes] = time.split(':').map(el=>parseInt(el,10))
  if (time.endsWith('pm') && hours !== 12) {
    hours += 12
  }
  return hours.toString()+':'+ (minutes === 0 ? '00' : minutes.toString())
}

function dayCharToInt(dayChar) {
  const days = ['su','m','t','w','r','f','sa']
  return days.indexOf(dayChar.toLowerCase())
}

function dayIntToRRULE(dayInt) {
  const days = ['su','mo', 'tu', 'we', 'th', 'fr', 'sa']
  return days[dayInt]
}
