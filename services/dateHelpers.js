const moment = require("moment")

function getRightTime(date) {
    if(!date) return date
    date = new Date(date)
    return moment(date).format("YYYY/MM/DD")
    // date.setDate(date.getDate()+1)
    // return date
    let year = date.getFullYear() === date.getUTCFullYear() ? date.getFullYear() : date.getFullYear() + 1
    let day = date.getDate() === date.getUTCDate() ? date.getDate() : date.getDate() + 1
    let month = date.getMonth() === date.getUTCMonth() ? date.getMonth() : date.getMonth() + 1
    return new Date(year, month, day)
    // console.log(date.toISOString())
}

function getDaysBetweenDates(startDate, endDate) {
  let dates = [];
  //to avoid modifying the original date
  endDate = new Date(endDate)
  const theDate = new Date(startDate);
  while (theDate < endDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, endDate];
  return dates.length
}

module.exports = {
  getDaysBetweenDates,
  getRightTime
};
