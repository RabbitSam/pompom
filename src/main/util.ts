/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { appendFile } from 'fs';

const LOG_FILENAME : string = "logs.txt";

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function sendEventResponse(event: Electron.IpcMainEvent, title: string, response: ElectronResponse) {
  if (!response.success) {
    logErrors(title, response.error?.message || "");
  }
  event.reply(title, response);
}

export function logErrors(eventTitle: string, info: string) {
  const date: string = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit"
  });

  appendFile(LOG_FILENAME, `[${date}]: ${eventTitle} -> ${info}`, {encoding: "utf-8"}, err => console.log(err));
}