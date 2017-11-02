function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function fakePreview(path) {
  return {name: path.substring(path.lastIndexOf('/')+1), path: config.image.waitForAdd, guid:  guid() };
}

function getLocalTimezoneName() {
  var timezone = jstz.determine();
  return timezone.name();
}

function toTimeZone(time, zone) {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment(time, format).tz(zone).format(format);
}

function distortToDefaultTimezone(date) {
  var newTimezone = moment().tz(moment().tz() || moment.tz.guess());
  var oldTimezone = moment().tz(moment.tz.guess());
  var differenceByMinutes = newTimezone.utcOffset() - oldTimezone.utcOffset();
  var newDate = new Date(date.getTime() + differenceByMinutes * 60000);
  return newDate;
}

function distortFromDefaultTimezone(date) {
  var newTimezone = moment().tz(moment().tz() || moment.tz.guess());
  var oldTimezone = moment().tz(moment.tz.guess());
  var differenceByMinutes = newTimezone.utcOffset() - oldTimezone.utcOffset();
  var newDate = new Date(date.getTime() - differenceByMinutes * 60000);
  return newDate;
}

function stopWatchStringToSeconds(str) {
    str = str.trim();
    var seconds = ( parseInt(str[0]) * 10 + parseInt(str[1]) ) * 60 + ( parseInt(str[3]) * 10 + parseInt(str[4]) );
    return seconds;
};

function convertSecondsToStopWatchString(sec) {
    var str = [];
    str[0] = Math.floor(sec/600);
    str[1] = Math.floor((sec % 600) / 60);
    str[2] = Math.floor((sec % 60) / 10);
    str[3] = (sec % 10);
    return "" + str[0] + str[1] + ":" + str[2] + str[3];
}

function isImage(path) {
    if (!path)
        return false;
    return !!path.match(/.+(\.jpg|\.jpeg|\.png|\.gif)$/);
}

function isGif(path) {
    if (!path)
      return false;
    return !!path.match(/.+(\.gif)$/);
}

function isVideo(path) {
    if (!path)
        return false;
    return !!path.match(/.+(\.mp4|\.avi|\.mpeg|\.flv|\.mov)$/);
}