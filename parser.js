export function parse(icsText)
{
    const icsLines = icsText.split("\n");
    
       
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