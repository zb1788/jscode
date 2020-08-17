import config from './prod';
export default Object.assign(config, {
    NODE_ENV: 'test',

    CONSOLE_DEBUG: true,
    CONSOLE_LOG: true,
    CONSOLE_INFO: true,
    CONSOLE_WARN: true
});