//For Persian Date Base Function
function t2j(date, f) {

  var g = t2g(date, false);


  return ginj(g.y, g.m, g.d, f);

}

/* gregorian to jalali */
function ginj(year, month, day, f) {

  let $g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  let $j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

  let $gy = year - 1600;
  let $gm = month - 1;
  let $gd = day - 1;

  let $g_day_no = 365 * $gy + div($gy + 3, 4) - div($gy + 99, 100) + div($gy + 399, 400);

  for (let $i = 0; $i < $gm; ++$i)
    $g_day_no += $g_days_in_month[$i];
  if ($gm > 1 && (($gy % 4 == 0 && $gy % 100 != 0) || ($gy % 400 == 0)))
    /* leap and after Feb */
    $g_day_no++;
  $g_day_no += $gd;

  let $j_day_no = $g_day_no - 79;

  let $j_np = div($j_day_no, 12053); /* 12053 = 365*33 + 32/4 */
  $j_day_no = $j_day_no % 12053;

  let $jy = 979 + 33 * $j_np + 4 * div($j_day_no, 1461); /* 1461 = 365*4 + 4/4 */

  $j_day_no %= 1461;

  if ($j_day_no >= 366) {
    $jy += div($j_day_no - 1, 365);
    $j_day_no = ($j_day_no - 1) % 365;
  }
  let $i;
  for ($i = 0; $i < 11 && $j_day_no >= $j_days_in_month[$i]; ++$i)
    $j_day_no -= $j_days_in_month[$i];
  let $jm = $i + 1;
  let $jd = $j_day_no + 1;

  function div(x, y) {
    return Math.floor(x / y);


  }
  if (!f || f == undefined)
    return { y: $jy, m: $jm, d: $jd }
  else
    return $jy + '/' + $jm + '/' + $jd;





}
/* jalali to gregorian  */
function jing(year, month, day, f) {
  function div(x, y) {
    return Math.floor(x / y);


  }
  let $g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  let $j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);



  let $jy = year - 979;
  let $jm = month - 1;
  let $jd = day - 1;

  let $j_day_no = 365 * $jy + div($jy, 33) * 8 + div($jy % 33 + 3, 4);
  for (let $i = 0; $i < $jm; ++$i)
    $j_day_no += $j_days_in_month[$i];

  $j_day_no += $jd;

  let $g_day_no = $j_day_no + 79;

  let $gy = 1600 + 400 * div($g_day_no, 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  $g_day_no = $g_day_no % 146097;

  let $leap = true;
  if ($g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
    $g_day_no--;
    $gy += 100 * div($g_day_no, 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    $g_day_no = $g_day_no % 36524;

    if ($g_day_no >= 365)
      $g_day_no++;
    else
      $leap = false;
  }

  $gy += 4 * div($g_day_no, 1461); /* 1461 = 365*4 + 4/4 */
  $g_day_no %= 1461;

  if ($g_day_no >= 366) {
    $leap = false;

    $g_day_no--;
    $gy += div($g_day_no, 365);
    $g_day_no = $g_day_no % 365;
  }
  let $i;
  for ($i = 0; $g_day_no >= $g_days_in_month[$i] + ($i === 1 && $leap); $i++)
    $g_day_no -= $g_days_in_month[$i] + ($i === 1 && $leap);
  let $gm = $i + 1;
  let $gd = $g_day_no + 1;

  if (!f || f == undefined)
    return { y: $gy, m: $gm, d: $gd };
  else
    return $gy + '/' + $gm + '/' + $gd;
}
/* time to gregorian  */
function t2g(date, f) {


  date = date * 1000;
  let d = new Date(date);
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  if (!f || f === undefined)
    return { y: year, m: month, d: day }
  else
    return year + '/' + month + '/' + day;
}

//end jalali date

//String***********************************************************************************************
String.prototype.toPersianNumber = function () {
  return this.replace(/\d+/g, function (digit) {
    let ret = '';
    for (let i = 0, len = digit.length; i < len; i++) {
      ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
    }

    return ret;
  });
};
Number.prototype.toPersianNumber = function () {
  return this.toString().replace(/\d+/g, function (digit) {
    var ret = '';
    for (var i = 0, len = digit.length; i < len; i++) {
      ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
    }

    return ret;
  });
};
Number.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this.toString(), 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
};
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.toPersianDate = function (format) {
  try {
    let target = new Date(this);
    let temp = this.split("T")[0].split("-");
    var date = ginj(Number(temp[0]), Number(temp[1]), Number(temp[2]), true);
    var time = target.getHours() + ":" + target.getMinutes();
    if (format === 'dateTime')
      return date + " ساعت: " + time;
    if (format === 'time')
      return time
    return date;
  } catch (ex) {
    return "...";
  }

 
};
// Date******************************************************************************************
Date.prototype.toPersianDate = function (format) {
  try {
    let temp = this.toJSON().split("T")[0].split("-");
    var date = ginj(Number(temp[0]), Number(temp[1]), Number(temp[2]), true);
    var time = this.getHours() + ":" + this.getMinutes();
    if (format === 'dateTime')
      return date + " ساعت: " + time;
    if (format === 'time')
      return time;
    if (format === 'week') {
      let dayOfWeak = this.getDay();
      let weakDays = ["", "دوشنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه", "شنبه", "یکشنبه"];
      return weakDays[dayOfWeak] + '  ' + date + " ساعت: " + time;
    }

    return date;
  }
  catch (e) {
    return "..."
  }

};
Date.prototype.addDay = function (day) {
  let dayAdd = day | 1;
  let newDate = new Date(this.setDate(this.getDate() + dayAdd));
  return newDate;
};
Date.prototype.timeToNow = function () {
  let target;
  try {
    target = new Date(this);
  } catch (ex) {
    return "فرمت اشتباه";
  }
  let now = new Date();
  let milisecend = now - target;
  let m = milisecend / 60000;
  if (m < 1)
    return 'جدیدا';
  if (m < 60)
    return Math.round(m) + ' دقیقه پیش';
  let h = m / 60;
  if (h < 24)
    return Math.round(h) + ' ساعت پیش';
  let day = h / 24;
  if (day < 7)
    return Math.round(day) + ' روز پیش';
  let w = day / 7;
  if (w < 4)
    return Math.round(w) + ' هفته پیش';
  let month = day / 30;
  if (month < 12)
    return Math.round(month) + ' ماه پیش';
  let year = month / 12;
  return Math.round(year) + ' سال پیش';
};
Number.prototype.format = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 0 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};






//Array
Array.prototype.chunkArray = function (myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  let myChunk;
  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
};
Array.prototype.removeDuplicates = function (myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

Array.prototype.shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp
  }
  return array
};







