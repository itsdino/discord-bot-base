import winston from "winston";

const format = winston.format.combine(
  winston.format.align(),
  winston.format.colorize(),
  winston.format.simple()
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
  transports: [new winston.transports.Console({ format })],
});
