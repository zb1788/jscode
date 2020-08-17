import config from './prod';
export default Object.assign(config, {
    NODE_ENV: 'test',
    BAIDU_MAP_AK: 'VQybhjLNbGVN1d56Wu8ek24owI6kF7p0',

    CONSOLE_DEBUG: true,
    CONSOLE_LOG: true,
    CONSOLE_INFO: true,
    CONSOLE_WARN: true,

    SERVER_URL: 'http://192.168.119.14/a.html',
});