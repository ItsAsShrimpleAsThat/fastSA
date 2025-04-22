const assignmentURL = "https://sonomaacademy.myschoolapp.com/api/assignment2/StudentAssignmentCenterGet?displayByDueDate=true";
const scheduleURL = "https://sonomaacademy.myschoolapp.com/api/schedule/ScheduleCurrentDayAnnouncmentParentStudent";

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

function setCookie(cookie)
{
    localStorage.setItem("cookie", cookie);
}

function deleteCookie()
{
    localStorage.removeItem("cookie");
}

function getSchedule()
{
    return requestFromWorker({"url": assignmentURL})
}
