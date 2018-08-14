const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDistance: formatDistance
}
/**
* 将距离格式化
* <1000m时 取整,没有小数点
* >1000m时 单位取km,一位小数点 
*/
function formatDistance(num) {
  　if (num < 1000) {
    　　return num.toFixed(0) + 'm';
  　} else if (num > 1000) {
    　　return (num / 1000).toFixed(1) + 'km';
  　}
}