import winston from "winston";
import path from 'path';

// Tentukan path untuk file log
const logPath = path.join(process.cwd(), '../log/pessanger.log');

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: logPath })],
});
