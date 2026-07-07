const fs = require('fs');
const path = require('path');
const { createLogger, transports, format } = require('winston');

const logsDir = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logsDir, { recursive: true });

const redact = format((info) => {
  if (typeof info.message === 'string') {
    info.message = info.message.replace(/(token|password|cookie|authorization)["':=\s]+([^,"\s]+)/gi, '$1=<redacted>');
  }
  return info;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    redact(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) =>
      `${timestamp} [${level.toUpperCase()}] ${stack || message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, 'execution.log') }),
    new transports.File({ filename: path.join(logsDir, 'errors.log'), level: 'error' })
  ]
});

module.exports = logger;
