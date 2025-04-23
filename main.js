import { setCookie, deleteCookie, getSchedule } from "./requester.js";
const scheduleTable = document.getElementById("scheduletable");
const schedule = await getSchedule();
console.log(schedule)

for(let scheduledItem of schedule)
{
    console.log("test")
    let row = document.createElement("div");
    row.classList.add("flexTr");

    let time = makeFlexTd("timeColumn");
    let block = makeFlexTd("blockColumn");
    let classActivity = makeFlexTd("classColumn");

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
