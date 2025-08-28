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

export function getSchedule(date)
{
    
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