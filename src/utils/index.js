/**
 * created by restran on 2016/07/10.
 */

let exports = {}
/**
 * 获取网站二级名称
 */
exports.getWebName = function () {
    let pathName = window.location.pathname.substring(1);
    let webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return webName;
}
/**
 * JSON转URL参数
 */
exports.parseParam = function (data) {
    try {
        let tempArr = [];
        for (let i in data) {
            let key = encodeURIComponent(i);
            let value = encodeURIComponent(data[i]);
            tempArr.push(key + '=' + value);
        }
        let urlParamsStr = tempArr.join('&');
        return urlParamsStr;
    } catch (err) {
        return '';
    }
}
/**
 * 获取URL参数值
 */
exports.getUrlParam = function (name, default_value, inputUrl) {
    //构造一个含有目标参数的正则表达式对象
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r;
    if (inputUrl != undefined && inputUrl != "") {
        r = inputUrl.match(reg);  //匹配目标参数
    }
    else {
        let url = decodeURI(window.location.search.substr(1));
        r = url.match(reg);  //匹配目标参数
    }
    if (r != null) return unescape(r[2]);
    if (default_value == undefined) {
        default_value = null;
    }
    return default_value; //返回参数值
};
/**
 * URL添加时间戳
 */
exports.urlAddTimestamp = function (url) {
    let result = "";
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (url.indexOf("?") > -1) {
        result = url + "&_timestamp=" + timestamp;
    }
    else {
        result = url + "?_timestamp=" + timestamp;
    }
    return result;
}
/**
 * 获取Cookie
 */
exports.getCookie = function (cname) {
    let name = cname + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
    }
    return undefined
}

exports.validator = {
    numberValidator: function (rule, value, callback) {
        if (isNaN(value)) {
            callback(new Error('请输入数字'))
        } else {
            callback()
        }
    }
}
/**
 * html 转义
 * @param string
 * @returns {string}
 */
exports.escapeHtml = function (string) {
    let matchHtmlRegExp = /["'&<>]/
    let str = '' + string
    let match = matchHtmlRegExp.exec(str)
    if (!match) {
        return str
    }

    let escape
    let html = ''
    let index = 0
    let lastIndex = 0

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;'
                break
            case 38: // &
                escape = '&amp;'
                break
            case 39: // '
                escape = '&#39;'
                break
            case 60: // <
                escape = '&lt;'
                break
            case 62: // >
                escape = '&gt;'
                break
            default:
                continue
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index)
        }

        lastIndex = index + 1
        html += escape
    }

    return lastIndex !== index
        ? html + str.substring(lastIndex, index)
        : html
}

exports.extendDict = function (oldDict, addDict) {
    for (let key in addDict) {
        if (addDict.hasOwnProperty(key)) {
            oldDict[key] = addDict[key]
        }
    }
    return oldDict
}

exports.copy = function (objects) {
    return JSON.parse(JSON.stringify(objects))
}

exports.formatNumber = function (num, nAfterDot) {
    let srcStr
    let resultStr, nTen
    srcStr = '' + num + ''
    let strLen = srcStr.length
    let dotPos = srcStr.indexOf('.', 0)
    let i, j
    if (dotPos === -1) {
        resultStr = srcStr + '.'
        for (i = 0; i < nAfterDot; i++) {
            resultStr = resultStr + '0'
        }
    } else {
        if ((strLen - dotPos - 1) >= nAfterDot) {
            // let nAfter = dotPos + nAfterDot + 1
            nTen = 1
            for (j = 0; j < nAfterDot; j++) {
                nTen = nTen * 10
            }
            resultStr = Math.round(parseFloat(srcStr) * nTen) / nTen
        } else {
            resultStr = srcStr
            for (i = 0; i < (nAfterDot - strLen + dotPos + 1); i++) {
                resultStr = resultStr + '0'
            }
        }
    }
    return resultStr
}

exports.dateFormat = function (date, formatStr) {
    let str = formatStr
    let week = ['日', '一', '二', '三', '四', '五', '六']
    let month = date.getMonth() + 1

    str = str.replace(/yyyy|YYYY/, date.getFullYear())
    str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100))

    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month)
    str = str.replace(/M/g, month)

    str = str.replace(/w|W/g, week[date.getDay()])

    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate())
    str = str.replace(/d|D/g, date.getDate())

    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours())
    str = str.replace(/h|H/g, date.getHours())
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes())
    str = str.replace(/m/g, date.getMinutes())

    str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds())
    str = str.replace(/s|S/g, date.getSeconds())

    return str
}

exports.cutStr = function (value, length) {
    if (value.length > length) {
        return value.substring(0, length) + '...'
    }
    else {
        return value;
    }
}

exports.NewGuid = function (type) {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    if (type == "N")
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    else
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
/**
 * 保留N位小数（四舍五入）
 */
exports.round = function (v, e) {
    let t = 1;
    for (; e > 0; t *= 10, e--) ;
    for (; e < 0; t /= 10, e++) ;
    return Math.round(v * t) / t;

}
/**
 * 保留N位小数（不四舍五入）
 */
exports.floor = function (v, e) {

    let t = 1;
    for (; e > 0; t *= 10, e--) ;
    for (; e < 0; t /= 10, e++) ;
    return Math.floor(v * t) / t;
}

/**
 * 去重
 */
Array.prototype.RemoveRepeat = function (key) {
    let x = this;
    let result = [];
    for (let i = 0; i < x.length; i++) {
        let flag = true;
        let temp = x[i];
        for (let j = 0; j < result.length; j++) {
            // 普通数组 (temp === result[j])
            if (temp[key] === result[j][key]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            result.push(temp);
        }
    }
    return result;
}

/**
 * 差集
 */
Array.prototype.Difference = function (key, y) {
    let x = this;
    let clone = x.slice(0);
    for (let i = 0; i < y.length; i++) {
        let temp = y[i];
        for (let j = 0; j < clone.length; j++) {
            // 普通数组 (temp === clone[j])
            if (temp[key] === clone[j][key]) {
                clone.splice(j, 1);
            }
        }
    }
    return clone.RemoveRepeat(key);
}

/**
 * 并集
 */
Array.prototype.Union = function (key, y) {
    let x = this;
    let result = x.concat(y)
    return result.RemoveRepeat(key);
}

/**
 * 交集
 */
Array.prototype.Intersection = function (key, y) {
    let x = this;
    let result = [];
    for (let i = 0; i < y.length; i++) {
        let temp = y[i];
        for (let j = 0; j < x.length; j++) {
            // 普通数组 (temp === clone[j])
            if (temp[key] === x[j][key]) {
                result.push(temp);
                break;
            }
        }
    }
    return result.RemoveRepeat(key);
}
String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d)
}
String.prototype.IsNullOrEmpty = function () {
    if (this == undefined || this == null || this == "")
        return true;
    else
        return false;
}
String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}
String.prototype.endWith = function (param) {

    if (param == null || param == "" || this.length == 0 || param.length > this.length) {
        return false;
    }

    if (this.substring(this.length - param.length) == param) {
        return true;
    } else {
        return false;
    }
}
String.prototype.count = function (param) {
    if (param == null || param == "" || this.length == 0 || param.length > this.length) {
        return 0;
    }
    let n = (this.split(param)).length - 1;
    return n;
}

exports.IsNullOrEmpty = function (val) {
    if (val == undefined || val == null || val == "")
        return true;
    else
        return false;
}

exports.stringToJSON = function (data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            return null;
        }
    }
    return data;
}
exports.stringToDate = function (value, bool) {
    if (value == undefined || value == null || value == "") {
        if (bool)
            return new Date();
        else
            return null;
    }
    else {
        try {
            return new Date(value.replace(/-/g, "/"));
        }
        catch (e) {
            return new Date();
        }
    }
}
exports.byteToMB = function (limit) {
    let size = "";
    if (limit == 0) {
        return "0KB"
    }
    if (limit < 1 * 1024) {                            //小于1KB，则转化成B
        size = limit.toFixed(2) + "B"
    } else if (limit < 1 * 1024 * 1024) {            //小于1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 1 * 1024 * 1024 * 1024) {        //小于1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {                                            //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }

    let sizeStr = size + "";                        //转成字符串
    let index = sizeStr.indexOf(".");                    //获取小数点处的索引
    let dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
    if (dou == "00") {                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
}
exports.browser = {
    os: function () {
        let os_type;
        let ua = navigator.userAgent.toLowerCase();
        if (/mac os/i.test(ua)) {
            os_type = 1;
        } else if (/android/i.test(ua)) {
            os_type = 0;
        } else {
            os_type = 5;
        }
        return os_type;
    },
    versions: function () {
        let u = navigator.userAgent;
        let r = {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
            qq: u.match(/\sQQ/i) == " QQ" //是否QQ
        };
        //console.log(r.weixin);
        if (r.iPad || r.iPhone) {
            r.ios = true;
        }
        if (r.android || r.ios || r.iPad) {
            r.mobile = true;
        }
        return r;
    }()
};

import http from './src/http'

exports.http = http

import jDate from './src/jDate'

exports.$Date = jDate
export default exports

