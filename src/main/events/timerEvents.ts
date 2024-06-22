import { ipcMain } from "electron";
import { mainWindow } from "../main";

// Wrapper to ensure timer event names are consistent
function timerEventWrapper(timerEvent: TimerEvent): TimerEvent {
    return timerEvent;
}

export type TimerEvent = "start-timer" | "end-timer";

export default function registerTimerEvents() {
    ipcMain.on(timerEventWrapper("start-timer"), async (event, arg) => {
        mainWindow?.unmaximize();
        mainWindow?.setSize(200, 200);
        mainWindow?.setMenuBarVisibility(false);
        mainWindow?.setAlwaysOnTop(true);
      
      });
      
    ipcMain.on(timerEventWrapper("end-timer"), async (event, arg) => {
        mainWindow?.setSize(1024, 768);
        mainWindow?.maximize();
        mainWindow?.setAlwaysOnTop(false);
    });
}