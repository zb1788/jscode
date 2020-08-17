import config from '../config';
import columns from '../config/columns';
import user from './user';
import userAgent from '../function/userAgent';
import address from '../function/addr';
import { appendScript } from '../utils/appendScript';

let storageKey = config.STORAGE_PREFIX + config.STORAGE_PAGE;
let channelStorageKey = config.STORAGE_PREFIX + config.STORAGE_CHANNELID;


let pageObj =  null;

const setPageObj = function (last, current) {

    var storage = window.localStorage;

    //var storage =   sessionStorage;

    let lastPageObj = last || pageObj || storage.getItem(storageKey) &&
    storage.getItem(storageKey) !== 'undefined' ?
    JSON.parse(storage.getItem(storageKey)) : {
        interview: null,
        title: null,
        url: null
    };
    let currentPageObj = current || {
        title: document.title,
        url: window.location.href,
        interview: new Date().getTime(),
    };
    pageObj = {
        lastPageObj: {// 这里重新记录一下上个页面
            interview: lastPageObj.interview,
            title: lastPageObj.title,
            url: lastPageObj.url
        },
        ...currentPageObj
    };
    // ps: 这里好粗糙啊，只能兼容单页面应用；app新开webview需要另外一种写法，需要监听关闭webview
    // 如果刷新，则不保存
    if (document.referrer !== currentPageObj.url) {
        storage.setItem(storageKey, JSON.stringify(currentPageObj));
    }
}

const getPageObjData = function () {
    return pageObj ? {
        [columns.interview]: pageObj.interview,// 进入页面的时间
        [columns.currentUrl]: urlFilter(pageObj.url),//当前页面的URL
        [columns.title]: pageObj.title,// 当前页面的标题
        [columns.referrerUrl]: urlFilter(document.referrer),//上个页面的URL
        [columns.referrerTitlt]: pageObj.lastPageObj.title,//上一个页面的标题
    } : {
        [columns.title]: document.title,
        [columns.currentUrl]: window.location.href,
        [columns.interview]: new Date().getTime(),
        [columns.referrerUrl]:null,
        [columns.referrerTitlt]:null
    };
}

const includes = function(str, needle) {
    return str.indexOf(needle) !== -1;
};

/**浏览器 */
const browser = function(user_agent, vendor, opera) {
    vendor = vendor || ''; // vendor is undefined for at least IE9
    if (opera || includes(user_agent, ' opr/')) {
        if (includes(user_agent, 'mini')) {
            return 'Opera Mini';
        }
        return 'Opera';
    } else if (/(blackberry|playbook|bb10)/i.test(user_agent)) {
        return 'BlackBerry';
    } else if (includes(user_agent, 'iemobile') || includes(user_agent, 'wpdesktop')) {
        return 'Internet Explorer Mobile';
    } else if (includes(user_agent, 'edge')) {
        return 'Microsoft Edge';
    } else if (includes(user_agent, 'fbios')) {
        return 'Facebook Mobile';
    } else if (includes(user_agent, 'chrome')) {
        return 'Chrome';
    } else if (includes(user_agent, 'crios')) {
        return 'Chrome iOS';
    } else if (includes(user_agent, 'ucweb') || includes(user_agent, 'ucbrowser')) {
        return 'UC Browser';
    } else if (includes(user_agent, 'fxios')) {
        return 'Firefox iOS';
    } else if (includes(vendor, 'apple')) {
        if (includes(user_agent, 'mobile')) {
            return 'Mobile Safari';
        }
        return 'Safari';
    } else if (includes(user_agent, 'android')) {
        return 'Android Mobile';
    } else if (includes(user_agent, 'konqueror')) {
        return 'Konqueror';
    } else if (includes(user_agent, 'firefox')) {
        return 'Firefox';
    } else if (includes(user_agent, 'msie') || includes(user_agent, 'trident/')) {
        return 'Internet Explorer';
    } else if (includes(user_agent, 'gecko')) {
        return 'Mozilla';
    } else {
        return '';
    }
}

/**浏览器版本 */
const browserVersion = function(userAgent, vendor, opera) {
    var br = browser(userAgent, vendor, opera);
    var versionRegexs = {
        'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
        'Microsoft Edge': /Edge\/(\d+(\.\d+)?)/,
        'Chrome': /Chrome\/(\d+(\.\d+)?)/,
        'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
        'UC Browser' : /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
        'Safari': /Version\/(\d+(\.\d+)?)/,
        'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
        'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
        'Firefox': /Firefox\/(\d+(\.\d+)?)/,
        'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
        'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
        'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
        'Android Mobile': /android\s(\d+(\.\d+)?)/,
        'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
        'Mozilla': /rv:(\d+(\.\d+)?)/
    };
    var regex = versionRegexs[br];
    if (regex === undefined) {
        return null;
    }
    var matches = userAgent.match(regex);
    if (!matches) {
        return null;
    }
    return parseFloat(matches[matches.length - 2]);
}

/**浏览器编码 */
const browserEncoding = function() {
    return document.characterSet || document.charset;
}

/**flash版本 */
const flashVersion = function() {
    var flashVer = '';
    if (window.ActiveXObject) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

        if (swf) {
            flashVer = Number(swf.GetVariable('$version').split(' ')[1].replace(/,/g, '.').replace(/^(d+.d+).*$/, "$1"));
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins['Shockwave Flash'];

            if (swf) {
                var arr = swf.description.split(' ');
                for (var i = 0, len = arr.length; i < len; i++) {
                    var ver = Number(arr[i]);

                    if (!isNaN(ver)) {
                        flashVer = ver;
                        break;
                    }
                }
            }
        }
    }
    return flashVer;
}

/**浏览器是否支持Java */
const browserSupportJava = function() {
    return navigator.javaEnabled();
}

// 报告跳转事件
export const pageView =async function (last, current) {
    try{
        !returnCitySN
    }catch (e) {
        await appendScript('https://pv.sohu.com/cityjson?ie=utf-8');
    }
        // 设置初次访问时间
    setTimeout(function() {
        setPageObj(last, current);
        user.updateLastVisitTime();
        // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 start
        var index = window.location.host;
        var pageflag ;
        var r_json = null;

        if (null == document.getElementById("__VCOM_ANALYTICS_PAGEFLAG")) {
            pageflag = "null";
        } else {
            pageflag = document.getElementById("__VCOM_ANALYTICS_PAGEFLAG").value;
            r_json = document.getElementById("__VCOM_ANALYTICS_PAGEFLAG").getAttribute('__VCOM_ANALYTICS_PARAM_INFO');
        }

        var obj = {};
        var params = {
            [columns.eventName]: '__VCOM_ANALYTICS_PV', // 这里配置事件名称
            [columns.eventDate]: new Date().getTime(),// 事件发生时的时间
            [columns.userCname]: pageflag,// 按钮名称
            // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 start
            [columns.platid]: index.substring(0,index.indexOf('.')),// 访问平台标识
            [columns.clientip]: returnCitySN["cip"],// 客户端ip
            [columns.clientid]: returnCitySN["cid"],// 客户端区域id
            [columns.clientname]: returnCitySN["cname"],// 客户端区域名称
            // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 end            
        };
        if(r_json == null){
            obj = params;         
        }else{
            try{
                obj = {
                    ...params,...JSON.parse(r_json)             
                }
            }catch(e){
                obj = params
            }            
        }        

        // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 end
        let data = setUpData(obj)
        send(data);
    });
}

// 报告点击事件
export const clickEvent = async function (e) {
    try{
        !returnCitySN
    }catch (e) {
        await appendScript('https://pv.sohu.com/cityjson?ie=utf-8');
    }
    // console.log('点击');
    let tg = getClickTarget(e.target);
    // console.log('触发了点击', tg);
    user.updateLastVisitTime();
    // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 start
    var index = window.location.host;
    // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 end
    if (tg) {
        // let actionName =tg.getAttribute("__VCOM_ANALYTICS_CLICK") || tg.getAttribute("__VCOM_ANALYTICS") || tg.textContent.match(/[\u4e00-\u9fa5]/g).join("") || null;                
        let actionName =tg.getAttribute("__VCOM_ANALYTICS_CLICK") || tg.getAttribute("__VCOM_ANALYTICS") || tg.textContent.replace(/[\r\n]/g,"").replace(/\s+/g, "") || null;                
        var r_json = tg.getAttribute('__VCOM_ANALYTICS_PARAM_INFO');
        var obj = {};
        var params = {
            [columns.eventName]: '__VCOM_ANALYTICS_CLICK', // 这里配置事件名称
            [columns.eventDate]: new Date().getTime(),// 事件发生时的时间
            [columns.userCname]: actionName,// 按钮名称
            // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 start
            [columns.platid]: index.substring(0,index.indexOf('.')),// 访问平台标识
            [columns.clientip]: returnCitySN["cip"],// 客户端ip
            [columns.clientid]: returnCitySN["cid"],// 客户端区域id
            [columns.clientname]: returnCitySN["cname"],// 客户端区域名称
            // vcom xuexiaofei add PV访问日志中增加访问平台标识 20190524 end
        }
        if(r_json == null){
            obj = params;           
        }else{
            try{
                obj = {
                    ...params,...JSON.parse(r_json)             
                }
            }catch(e){
                obj = params
            }
        }
        let data = setUpData(obj)
        send(data);
        user.updateLastVisitTime();
    }
}

const getClickTarget = function (node, lv) {
    // 默认button标签、a标签、有点击类的标签需要采集并发送数据
    // if (tg.nodeName === 'BUTTON' || tg.nodeName === 'A' || tg.classList.contains('DSJ__click')) {
    lv = lv || 1;
    try{
        if (node.classList.contains('__VCOM_ANALYTICS_CLICK') || node.getAttribute("__VCOM_ANALYTICS_CLICK") !== null) {
            return node;
        } else if (lv <= 3 && 'BODY' !== node.parentNode.nodeName) {
            return getClickTarget(node.parentNode, lv++);
        } else {
            return null
        }
    }catch(e){}
}

// 监听点击事件
const clickWatch = function () {
    if(document.addEventListener){
        document.addEventListener("click", clickEvent, true);
    }else if(document.attachEvent){//兼容IE
        document.attachEvent("click", clickEvent);
    }
}

clickWatch();

// 报告自定义事件
export const customEvent = function (event,data) {
    user.updateLastVisitTime();
    let mydata = setUpData({
        [columns.eventName]: event, // 事件名称
        [columns.eventDate]: new Date().getTime(),// 事件发生时的时间
        [columns.userCname]: '',// 按钮名称
    })
    for(let i in data){//遍历属性
        mydata["utm_"+i]=data[i];//防止冲突加上前缀pm
    }
    send(mydata);
}

function urlFilter (url) {
    return url
}

export const login = function (info) {
    user.login(info)
}

export const logout = function() {
    user.logout();
}

// 组合数据
function setUpData (data) {
    return {
        [columns.platform]: config.PLATFORM,// 系统平台
        ...userAgent.data,// ua相关信息
        ...address.data,// 地址相关信息
        ...user.data,// 用户信息
        ...getPageObjData(),
        ...data // 传入的参数
    }
}

// 发送到服务器
function send(params) {
    //Document对象数据
    if(document) {
        params.domain = document.domain || ''; 
    }   
    //Window对象数据
    if(window && window.screen) {
        /*屏幕高度*/
        params.utmsh = window.screen.height || 0;
        /*屏幕宽度*/
        params.utmsw = window.screen.width || 0;
        /*颜色深度*/
        params.utmcd = window.screen.colorDepth || 0;  
    } 
    //navigator对象数据
    if(navigator) {
        /*客户端语言*/
        params.utmln = navigator.language || ''; 
        /*浏览器*/
        params.utmbr = browser(navigator.userAgent.toLowerCase(), navigator.vendor, window.opera);
        /*浏览器语言*/
        //params.utmln = browserVersion(navigator.userAgent.toLowerCase(), navigator.vendor, window.opera);
        /*网络类型*/
        if(navigator.connection) {
            params.utmnt = navigator.connection.effectiveType;
        }
    } 

    /*浏览器编码*/
    params.utmbe = browserEncoding();
    /*flash版本*/
    params.utmfv = flashVersion();
    /*浏览器是否支持Java*/
    params.utmbsj = browserSupportJava();
    params.channelid = sessionStorage.getItem(channelStorageKey) && sessionStorage.getItem(channelStorageKey) !== 'undefined'?
                    sessionStorage.getItem(channelStorageKey):'';

    //拼接参数串
    var args = ''; 
    for(var i in params) {
        if(args != '') {
            args += '&';
        }   
        args += i + '=' + encodeURIComponent(params[i]);
    }

    //创建一个图片对象,参数为宽度和高度
    var i2 = new Image(1, 1);
    //图片加载过程中发生错误时调用的事件句柄
    i2.onerror = function (error) {
        // 这里可以进行重试操作
    };
    //更改i2的src然后会访问所在位置，服务器会记录访问日志
    i2.src = config.SERVER_URL + "?" + args;
}
// vcom xuexiaofei add 增加设置访问来源的方法 start
export const setPlatform = function (pvalue) {
    var storage = window.localStorage;
    storage.setItem("__VCOM_ANALYTICS_PLATFORM",pvalue);
}
// vcom xuexiaofei add 增加设置访问来源的方法 end

export const setChannelId = function(id){
    sessionStorage.setItem(channelStorageKey, id);
}