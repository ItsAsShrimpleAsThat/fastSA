import { setCookie, deleteCookie, getSchedule } from "./requester.js";
import { humanTimeTodayToUnixTime, parseICS, getDailySchedule } from "./parser.js";
import { testSchedule } from "./schedule.js";
import { getTestICS } from "./testics.js";

const scheduleTable = document.getElementById("scheduletable");

// const schedule = await getSchedule();
const schedule = testSchedule();
const currentUnix = Date.now() / 1000.0
console.log(schedule)

for(let scheduledItem of schedule)
{
    let row = document.createElement("div");
    row.classList.add("flexTr");

    let time = makeFlexTd("timeColumn");
    let block = makeFlexTd("blockColumn");
    let classActivity = makeFlexTd("classColumn");

    time.innerHTML = disappearingResponsiveLabel("Time:") + scheduledItem.MyDayStartTime + " - " + scheduledItem.MyDayEndTime;
    block.innerHTML = disappearingResponsiveLabel("Block:") + (scheduledItem.Block.length > 8 ? makeAcronym(scheduledItem.Block) : scheduledItem.Block );
    classActivity.innerHTML = disappearingResponsiveLabel("Class:") + scheduledItem.CourseTitle;


    if(currentUnix > humanTimeTodayToUnixTime(scheduledItem.MyDayEndTime))
    {
        row.classList.add("completedClass");
    }
    else if(currentUnix > humanTimeTodayToUnixTime(scheduledItem.MyDayStartTime))
    {
        row.classList.add("inprogressClass");
    }

    row.appendChild(time);
    row.appendChild(block);
    row.appendChild(classActivity);

    scheduleTable.appendChild(row)
}

function makeFlexTd(column)
{
    let flextd = document.createElement("div");
    flextd.classList.add("flexTd");
    flextd.classList.add(column);

    return flextd;
}

function disappearingResponsiveLabel(label)
{
    return "<span class=\"responsivelabel\">" + label + "&nbsp;</span>"
}

function makeAcronym(str) {
    return str
      .split(/\s+/)               // Split by whitespace
      .filter(word => word.length > 0) // Skip empty words
      .map(word => word[0].toUpperCase()) // Get first letter and uppercase it
      .join('');
  }

console.log("Parsed ics schedule:");
console.log(getDailySchedule(parseICS(getTestICS()), new Date()))