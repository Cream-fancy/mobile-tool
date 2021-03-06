Date.prototype.Format = function(fmt = 'yyyy/MM/dd HH:mm:ss') {
  var o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // date
    "H+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
      "00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
