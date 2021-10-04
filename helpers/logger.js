const winston = require('winston');
const colorizer = winston.format.colorize();

module.exports = function(label = 'System') {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.label({label: label}),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `[${info.label} ${info.timestamp.replace(/T/, ' ').replace(/\..+/, '')}] ${info.level.toUpperCase()}: ${info.message}`;
        }),
    ),
    transports: [
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      new winston.transports.Console({
        format: winston.format.printf((info) =>
          colorizer.colorize(info.level, `[${info.label} ${info.timestamp.replace(/T/, ' ').replace(/\..+/, '')}] ${info.level.toUpperCase()}: ${info.message}`),
        ),
      }),
      new winston.transports.File({filename: 'error.log', level: 'error'}),
      new winston.transports.File({filename: 'combined.log'}),
    ],
  });
};
