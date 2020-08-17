var storage = window.localStorage;

function checkDebug(){
    return storage.getItem('vcom_debug') && storage.getItem('vcom_debug') != 'undefined' ? true : false;
}

// 调试模式下才显示每一步的步骤
function debug () {
    if (checkDebug()) console.debug.apply(console, arguments);
}

// 普通的结果信息
function log() {
    if (checkDebug()) console.log.apply(console, arguments);
}

// 比较重要的运行结果
function info () {
    if (checkDebug()) console.info.apply(console, arguments);
}

// 运行出现的警告
function warn () {
    if (checkDebug()) console.warn.apply(console, arguments);
}

// 运行抛出的错误必须显示，无需重写

const myConsole = Object.assign({}, console, {
    debug,
    log,
    info,
    warn
})

export default myConsole;