// DOM searching functions go here.

export function onDetailedSchedulePage() {
  return (document.querySelector('div.pagetitlediv h2').textContent === 'View detailed timetable')
}

export function getSemester() {
  return document.querySelector('div.staticheaders').childNodes[2].textContent.split(': ')[1]
}

export function getClassSections() {
  return document.querySelectorAll('div#P_CrseSchdDetl > table.datadisplaytable')
}

export function getScheduledMeetingTimes(classSection) {
  let scheduledMeetingTimesTable = classSection.querySelector('table.datadisplaytable.tablesorter > tbody > tbody')
  return [...scheduledMeetingTimesTable.rows]
}

export function getClassSectionTitle(classSection) {
  return classSection.querySelector('caption').textContent
}

const headerLinks = document.querySelector('span.pageheaderlinks')
export function insertExportLink(exportLink) {

  // During dev reloading extension caused multiple buttons to be added
  let oldLink = headerLinks.querySelector('#uvical_export')
  if (oldLink) {
    headerLinks.removeChild(oldLink)
  }

  headerLinks.insertBefore(exportLink, headerLinks.firstChild)
}
