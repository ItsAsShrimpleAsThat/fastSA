const classNames = [];
const fullClassNames = [];
const fullNameToClassName = {};

const baseEvent = { "UID": null, "DTSTART": new Date(), "DTEND": new Date(), "dtStartHasTime": false, "dtEndHasTime": false, "SUMMARY": "" };
export function parseICS(scheduleIcs)
{
    let inEvent = false;

    let schedule = [];
    let calEvent = JSON.parse(JSON.stringify(baseEvent));
    let line = ""

    for(line of scheduleIcs.split("\n"))
    {
        if(line == "BEGIN:VEVENT")
        {
            calEvent = JSON.parse(JSON.stringify(baseEvent));
            inEvent = true;
        }
        if(line == "END:VEVENT")
        {
            schedule.push(calEvent);
            calEvent = {};
            inEvent = false;
        }
        else if(inEvent)
        {
            if(line.substring(0, 4) == "UID:")
            {
                calEvent.UID = line.substring(5, line.length);
            }
            else if(line.substring(0, 7) == "DTSTART")
            {
                if(line.substring(8, 18) == "VALUE=DATE")
                {
                    calEvent.DTSTART = parse8601withoutTime(line.substring(19))
                    calEvent.dtStartHasTime = false;
                }
                else if(line.substring(8, 12) == "TZID")
                {
                    calEvent.DTSTART = parse8601withTime(line.substring(line.length - 15))
                    calEvent.dtStartHasTime = true;
                }
            }
            else if(line.substring(0, 5) == "DTEND")
            {
                if(line.substring(6, 16) == "VALUE=DATE")
                {
                    calEvent.DTEND = parse8601withoutTime(line.substring(17))
                    calEvent.dtEndHasTime = false;
                }
                else if(line.substring(6, 10) == "TZID")
                {
                    calEvent.DTEND = parse8601withTime(line.substring(line.length - 15))
                    calEvent.dtEndHasTime = true;
                }
            }
            else if(line.substring(0, 7) == "SUMMARY")
            {
                calEvent.SUMMARY = line.substring(8);
            }
        }
    }

    return schedule;
}

export function getDailySchedule(events, date)
{
    let firstItemThatMatchesTodaysDateIndex = events.findIndex(calEvent => datesMatch(date, calEvent.DTSTART));

    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1)
    let firstItemThatMatchesTomorrowsDateIndex = events.findIndex(calEvent => datesMatch(tomorrow, calEvent.DTSTART));

    console.log("today index:" + firstItemThatMatchesTodaysDateIndex)
    console.log("tmr index:" + firstItemThatMatchesTomorrowsDateIndex)

    if(firstItemThatMatchesTodaysDateIndex == -1)
    {
        return [];
    }
    if(firstItemThatMatchesTomorrowsDateIndex == -1)
    {
        firstItemThatMatchesTomorrowsDateIndex = events.length;
    }

    let todaysSchedule = [];
    const baseDay = { "MyDayStartTime": "12:00 AM", "MyDayEndTime": "12:00 AM", "Block": "Null", "CourseTitle" : "Null Title" };
    const options = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };

    for(let i = firstItemThatMatchesTodaysDateIndex; i < firstItemThatMatchesTomorrowsDateIndex; i++)
    {
        let scheduleItem = JSON.parse(JSON.stringify(baseDay));
        let icsItem = events[i];

        scheduleItem.MyDayStartTime = icsItem.DTSTART.toLocaleString("en-US", options);
        scheduleItem.MyDayEndTime = icsItem.DTEND.toLocaleString("en-US", options);
        scheduleItem.Block = getBlockFromFullClassString(icsItem.SUMMARY);
        scheduleItem.CourseTitle = icsItem.SUMMARY;

        todaysSchedule.push(scheduleItem);
    }

    return todaysSchedule;
}

function getBlockFromFullClassString(classString)
{
    let lastParenthesisIndex = classString.lastIndexOf("(");
    if(classString.substring(lastParenthesisIndex + 1, lastParenthesisIndex + 3) == "YL")
    {
        return classString.substring(lastParenthesisIndex - 2, lastParenthesisIndex + 4);
    }
    return classString.substring(lastParenthesisIndex + 1, lastParenthesisIndex + 2);
}

function datesMatch(date1, date2)
{
    return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
}

function parse8601withTime(timestamp)
{
    // ymd
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1; // for some weird ass reason the Date() constructor interprets 0 to be January
    const day = parseInt(timestamp.substring(6, 8));

    // time
    const hour = parseInt(timestamp.substring(9, 11)); // 24hr format
    const minute = parseInt(timestamp.substring(11, 13));
    const second = parseInt(timestamp.substring(13, 15));

    return new Date(year, month, day, hour, minute, second, 0);
}

function parse8601withoutTime(timestamp)
{
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1; // for some weird ass reason the Date() constructor interprets 0 to be January
    const day = parseInt(timestamp.substring(6, 8));

    return new Date(year, month, day, 0, 0, 0, 0);
}

function getClassName(summaryLine) {
    if (!summaryLine.startsWith("SUMMARY:")) return null;
  
    const content = summaryLine.slice("SUMMARY:".length).trim();
  
    const colonIndex = content.indexOf(": ");
    if (colonIndex !== -1) {
      const before = content.slice(0, colonIndex).trim();
      const after = content.slice(colonIndex + 2).trim();
  
      // Match things like "6B", "5C", "6D (D)", etc. at the end of the class name
      const classEndingPattern = /\b\d+[A-Z]( \([A-Z]\))?$/;
      if (classEndingPattern.test(before)) {
        return before;
      } else {
        return content; // colon is likely part of class name
      }
    } else {
      return content; // no colon, treat entire thing as class name
    }
}

export function humanTimeTodayToUnixTime(humanTime) 
{
    const [time, meridian] = humanTime.trim().split(/\s+/); // splits on any whitespace
    let [hours, minutes] = time.split(':').map(Number);
  
    // Convert to 24-hour format
    if (meridian.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
  
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
  
    return Math.floor(now.getTime() / 1000);
}