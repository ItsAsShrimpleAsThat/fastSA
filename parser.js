export function parse(icsText)
{
    const icsLines = icsText.split("\n");
     
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