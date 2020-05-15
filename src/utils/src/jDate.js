//替换字符串
function Replace(str, from, to) {
    return str.split(from).join(to);
}

//js日期字符串转换成日期类型
function parseDate(dateStr) {
    return new Date(Replace(dateStr, "-", "/"));
}

//返回月份(两位数)
function GetFullMonth(date) {
    var v = date.getMonth() + 1;
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回日(两位数)
function GetFullDate(date) {
    var v = date.getDate();
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回时(两位数)
function GetFullHour(date) {
    var v = date.getHours();
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回分(两位数)
function GetFullMinutes(date) {
    var v = date.getMinutes();
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回秒(两位数)
function GetFullSeconds(date) {
    var v = date.getSeconds();
    if (v > 9) return v.toString();
    return "0" + v;
}

// 日期类型格式成指定的字符串
Date.prototype.FormatDate = function (format) {
    format = Replace(format, "yyyy", this.getFullYear());
    format = Replace(format, "MM", GetFullMonth(this));
    format = Replace(format, "dd", GetFullDate(this));
    format = Replace(format, "HH", GetFullHour(this));
    format = Replace(format, "mm", GetFullMinutes(this));
    format = Replace(format, "ss", GetFullSeconds(this));
    return format;
}


Date.prototype.AddYears = function (value) {
    var curr = new Date(this.toString());
    curr.setFullYear(curr.getFullYear() + value);
    return curr;
}
Date.prototype.AddMonths = function (value) {
    var curr = new Date(this.toString());
    var month = curr.getMonth() + value;
    var new_date = new Date(curr.getFullYear(), (month + 1), 1);
    var last_date = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
    if (curr.getDate() > last_date) {
        curr.setMonth(month, last_date);
    }
    else {
        curr.setMonth(month);
    }
    return curr;
}
//增加天
Date.prototype.AddDays = function (value) {
    var curr = new Date(this.toString());
    curr.setDate(curr.getDate() + value);
    return curr;
}
//增加时
Date.prototype.AddHours = function (value) {
    var curr = new Date(this.toString());
    curr.setHours(curr.getHours() + value);
    return curr;
}
Date.prototype.AddMinutes = function (value) {
    var curr = new Date(this.toString());
    curr.setMinutes(curr.getMinutes() + value);
    return curr;
}
Date.prototype.AddSeconds = function (value) {
    var curr = new Date(this.toString());
    curr.setSeconds(curr.getSeconds() + value);
    return curr;
}

String.prototype.toDateString = function () {
    return this.substr(0, 4) + "-" + this.substr(4, 2) + "-" + this.substr(6, 2);
}
String.prototype.toDate = function () {
    var oDate = new Date(this.substr(0, 4) + "/" + this.substr(4, 2) + "/" + this.substr(6, 2));
    return oDate;
}
//增加年
String.prototype.AddYears = function (value) {
    var newdate = new Date(this);
    newdate.setFullYear(newdate.getFullYear() + value);
    return newdate;
}
//增加月
String.prototype.AddMonths = function (value) {
    var curr = new Date(this);
    var month = curr.getMonth() + value;
    var new_date = new Date(curr.getFullYear(), (month + 1), 1);
    var last_date = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
    if (curr.getDate() > last_date) {
        curr.setMonth(month, last_date);
    }
    else {
        curr.setMonth(month);
    }
    return curr;
}
//增加天
String.prototype.AddDays = function (value) {
    var newdate = new Date(this);
    newdate.setDate(newdate.getDate() + value);
    return newdate;
}
//增加时
String.prototype.AddHours = function (value) {
    var newdate = new Date(this);
    newdate.setHours(newdate.getHours() + value);
    return newdate;
}
//增加分
String.prototype.AddMinutes = function (value) {
    var newdate = new Date(this);
    newdate.setMinutes(newdate.getMinutes() + value);
    return newdate;
}

function getDateStr(timeStr) {
    if (timeStr == null || timeStr == "" || timeStr == undefined)
        return "";
    var time = new Date(timeStr);
    var now = new Date();
    if (now.getDate() == time.getDate()) {
        if ((now.getHours() - time.getHours()) > 6)
            return "今天";
        else
            return time.FormatDate("HH:mm");
    }
    else
        return time.FormatDate("yyyy-MM-dd");
}

//比较两个时间
function comptime(bTime, eTime, obj) {
    var beginTime = bTime.FormatDate("yyyy-MM-dd HH:mm:ss");
    var endTime = eTime.FormatDate("yyyy-MM-dd HH:mm:ss");
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');
    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

    var a = (Date.parse(beginTime) - Date.parse(endTime)) / 3600 / 1000;
    var s = a + obj + "0";
    if (eval('(' + s + ')'))
        return true;
    else
        return false;
}

function getCurrDate() {
    let date = new Date()
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    return new Date(y, m, d);
}

function getMonthFirstDate(date) {
    if (!date) {
        date = new Date();
    }
    var y = date.getFullYear();
    var m = date.getMonth();
    return new Date(y, m, 1);
}

function getMonthLastDate(date) {
    if (!date) {
        date = new Date();
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return getLastDay(y, m, 1);
}

function getLastDay(year, month, i) {
    var new_year = year;  //取当前的年份
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12)      //如果当前大于12月，则年份转到下一年
    {
        new_month -= 12;    //月份减
        new_year++;      //年份增
    }
    var new_date = new Date(new_year, new_month, 1);        //取当年当月中的第一天
    var last_date = new Date(new_date.getTime() - 1000 * 60 * 60 * 24);
    if (i == undefined || i == 0)
        return last_date.getDate();//获取当月最后一天日期
    else
        return last_date
}

export default {
    parseDate: parseDate,
    getDateStr: getDateStr,
    comptime: comptime,
    getLastDay: getLastDay,
    getCurrDate: getCurrDate,
    getMonthFirstDate: getMonthFirstDate,
    getMonthLastDate: getMonthLastDate
}
