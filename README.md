# UVICalendar
Export your UVIC detailed timetable as an iCalendar file for use with google calendar, iCal, or other calendar program.

## Getting started
To get started with uvicalendar, Ensure you have nodejs and npm installed and available in your shell. Then follow these steps:

#### Clone the repository
````
git clone https://github.com/Tacklebox/uvicalendar.git && cd uvicalendar
````
#### Install the necessary dependencies 
````
npm install --dev
````
#### Build the extension
````
npm run build
````
#### Try it out!
If you use firefox and have web-ext installed globally, you can run `npm run dev`, or alternatively,
check out the instructions to load a local extension for [Chrome](https://developer.chrome.com/extensions/getstarted#unpacked) or [Firefox](https://www.youtube.com/watch?time_continue=13&v=cer9EUKegG4)
Note that the directory of the unpacked extension is 'dist', not the root directory of the repository.

Navigate to Student Services >> Registration >> Detailed timetable in the mypage area of the main UVIC website. There should be an additional
button called 'export' at the top right of the timetable area beside the two existing buttons 'print' and 'help'. Clicking this button 
should prompt you to download a .calendar file representing your timetable.

Refer to your calendar application's documentation for how to import a calendar. I strongly recommend adding it to a new blank calendar
rather than your existing calendar to ensure that the classes were created correctly. If not, delete that calendar and file an issue =D.

## Other Stuff
Feel free to open an issue if you have any trouble getting things working or if you encounter any errors in calendar generation.
Due to the nature of the use case, the only test page I have is my own timetable so there are probably many edge cases that I am simply
unable to encounter. Also feel free to open a pull request if you have a bug fix or new feature.
