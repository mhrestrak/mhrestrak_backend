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

module.exports = {
  getRightTime,
};
