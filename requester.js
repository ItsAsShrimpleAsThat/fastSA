const assignmentURL = "https://sonomaacademy.myschoolapp.com/api/assignment2/StudentAssignmentCenterGet?displayByDueDate=true";
const announcementURL = "https://sonomaacademy.myschoolapp.com/api/schedule/ScheduleCurrentDayAnnouncmentParentStudent";
const scheduleURL = "https://sonomaacademy.myschoolapp.com/api/schedule/MyDayCalendarStudentList/";

const APIworker = "https://saic.andrew-lang-1de.workers.dev";
const calanderWorker = "https://sagc.andrew-lang-1de.workers.dev"

function requestFromAPIWorker(params)
{
    const queryString = new URLSearchParams(params).toString();

    return fetch(`${APIworker}?${queryString}`, { method: "GET", headers: { "Biscuit": "t=" + getCookie(), "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } })
    .then(response => response.json())
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

export async function getSchedule()
{
    return await requestFromAPIWorker({"url": scheduleURL})
}

export function getAssignments()
{
    return requestFromAPIWorker({"url": assignmentURL})
}

function requestFromCalanderWorker(calander)
{
    fetch(calanderWorker, {
        method: 'GET',
        headers: {
          'X-Target-Url': calander
        }
      })
        .then(res => res.text())
        .then(ics => {
          return ics
        })
        .catch(err => console.error("Error fetching ICS:", err));
}