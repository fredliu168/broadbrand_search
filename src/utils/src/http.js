/**
 * created by restran on 2017/05/16.
 */
import router from '../../router'
import axios from 'axios'

let JCode = {
    /*成功*/
    Success: 10000,
    /*没有相关数据*/
    Empty: 10001,
    /*尚未登录，或验证码已过期*/
    UnauthorizedResult: 10002,
    NoPrivilege: 10009,
    /*失败*/
    Failure: -10000,
    /*系统抛出了异常*/
    ActionExecutingFailure: -10002,
    /*请求出错*/
    Err: -99999
};


function parseHttpResponse(response, resolve, reject, loginRedirect) {
    let rawData = response.data
    // 在一些Android手机的微信中, 会出现没有解析成JSON, 而是仍然为字符串
    // 需要手动解析
    if (typeof rawData === 'string') {
        try {
            rawData = JSON.parse(rawData)
        } catch (e) {
            console.log('error')
            rawData = {
                value: null,
                message: '服务端返回的数据有误',
                code: JCode.Failure
            }
        }
    }

    let value = null
    let message = '请求出错'
    let code = JCode.Err
    try {
        value = rawData.value;
        message = rawData.message;
        code = rawData.code
    } catch (e) {
    }

    if (code === JCode.Success) {
        try {
            resolve(rawData)
        } catch (e) {
            rawData.message = '数据处理出现异常'
            reject(rawData)
        }
    } else {
        // 尚未登录，或验证码已过期，自动跳转到登录页面
        if (code === JCode.UnauthorizedResult && loginRedirect !== false) {
            let hash = window.location.hash;
            hash = hash.replace("#/login", "");
            return router.push({path: '/login' + hash})
        } else if (code === JCode.NoPrivilege) {// 没权限，自动跳转到错误页面
            router.push({path: '/err'})
        } else {
            reject(rawData)
        }
    }
}

function parseHttpError(error, reject) {
    let rawData = error.response.data
    if (typeof rawData === 'string') {
        try {
            rawData = JSON.parse(rawData)
        } catch (e) {
            rawData = {
                message: '服务器无响应，请稍后再试',
                code: 500,
                value: null
            }
        }
    }
    reject(rawData)
}

let http = {
    JCode: JCode,
    addHeader: function (name, value) {
        axios.defaults.headers[name] = value
    },
    get: function (url, paramsData, config = null, loginRedirect = true) {
        return new Promise(function (resolve, reject) {
            axios.get(
                url, {
                    params: paramsData,
                    config: config
                }
            ).then(function (response) {
                parseHttpResponse(response, resolve, reject, loginRedirect)
            }).catch(function (error) {

                parseHttpError(error, reject)
            })
        })
    },
    post: function (url, postData, config = null, loginRedirect = true) {
        return new Promise(function (resolve, reject) {
            axios.post(
                url, postData, config
            ).then(function (response) {
                parseHttpResponse(response, resolve, reject, loginRedirect)
            }).catch(function (error) {
                parseHttpError(error, reject)
            })
        })
    }
}

export default http
