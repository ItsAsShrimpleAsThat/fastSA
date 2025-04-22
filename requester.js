const assignmentURL = "https://sonomaacademy.myschoolapp.com/api/assignment2/StudentAssignmentCenterGet?displayByDueDate=true";
const announcementURL = "https://sonomaacademy.myschoolapp.com/api/schedule/ScheduleCurrentDayAnnouncmentParentStudent";
const scheduleURL = "https://sonomaacademy.myschoolapp.com/api/schedule/MyDayCalendarStudentList/";

const worker = "https://saic.andrew-lang-1de.workers.dev";

function requestFromWorker(params)
{
    const queryString = new URLSearchParams(params).toString();

    fetch(`${worker}?${queryString}`, { method: "GET", headers: { "Biscuit": "t=" + getCookie(), "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error("error happened whoops: ", error);
    });
}

function getCookie()
{
    return localStorage.getItem("cookie");
}

export function setCookie(cookie)
{
    localStorage.setItem("cookie", cookie);
}

export function deleteCookie()
{
    localStorage.removeItem("cookie");
}

export function getSchedule()
{
    return requestFromWorker({"url": scheduleURL})
}

export function getAssignments()
{
    return requestFromWorker({"url": assignmentURL})
}

