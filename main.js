import { setCookie, deleteCookie, getSchedule } from "./requester.js";
import { humanTimeTodayToUnixTime } from "./parser.js";
import { testSchedule } from "./schedule.js";
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
    block.innerHTML = disappearingResponsiveLabel("Block:") + scheduledItem.Block;
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