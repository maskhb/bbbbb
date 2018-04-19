const logIds = {
  debug: 1,
  info: 1,
  warn: 1,
  error: 1,
};
const logColors = {
  debug: 'black',
  info: '#006390',
  warn: '#900000',
  error: 'red',
};
function logA(level, ...msg) {
  if (process.env.NODE_ENV !== 'production') {
    console[level](`%c${level}#${logIds[level]++}>`, `color: ${logColors[level]};font-size: 14px;`, ...msg); // eslint-disable-line
  }
}

function debug(...msg) {
  logA(debug.name, ...msg);
}

function info(...msg) {
  logA(info.name, ...msg);
}

function warn(...msg) {
  logA(warn.name, ...msg);
}

function error(...msg) {
  logA(error.name, ...msg);
}

const log = {
  debug, info, warn, error,
};

const logger = (...msg) => {
  info(...msg);
};

Object.assign(logger.constructor.prototype, log);
export default logger;
