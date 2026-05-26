import type { NextFunction, Request, Response } from "express";
import fs from "fs";
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    "Method - URL - Time:",
    req.method,
    req.url,
    Date.now().toLocaleString(),
  );
  const log = `\nMethod -> ${req.method} - Time -> ${new Date().toLocaleString()} - URL -> ${req.url}\n`;
  fs.appendFile("logger.txt", log, (err) => {});
  next();
};
export default logger;
