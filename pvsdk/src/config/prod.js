export default {
    NODE_ENV: 'prod',// 环境名称
    BAIDU_MAP_AK: 'VQybhjLNbGVN1d56Wu8ek24owI6kF7p0',
    STORAGE_PREFIX: 'vcom_',// 存储变量命名空间/前缀
    STORAGE_ADDRESS: 'address_info',// 地址存储
    STORAGE_USER_AGENT: 'user_agent_info',// ua存储
    STORAGE_USERINFO: 'user_info',// 用户列表存储
    STORAGE_PAGE:'page_info',// 保存当前页面和之前页面的信息
    STORAGE_CHANNELID:'channel_id',//栏目id
    CONSOLE_DEBUG: false,
    CONSOLE_LOG: false,
    CONSOLE_INFO: true,
    CONSOLE_WARN: true,

    SERVER_URL: 'https://center.czbanbantong.com/pv/bp/__utm.gif',

    SESSION_TIMEOUT: 600,// 单位秒,默认 10分钟

    // 以下为配置项
    USERNAME_KEY: 'utm_uuid',// 用户ID取值字段
    PLATFORM: 'web',// 平台名称
    AUTO_PV: false,// 进入页面或者刷新时自动调用pageView开关
}