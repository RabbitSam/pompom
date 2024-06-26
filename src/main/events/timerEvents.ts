import { ipcMain } from "electron";
import { mainWindow } from "../main";

// Wrapper to ensure timer event names are consistent
function timerEventWrapper(timerEvent: TimerEvent): TimerEvent {
    return timerEvent;
}

export type TimerEvent = "start-timer" | "end-timer";

export default function registerTimerEvents() {
    let wasMaximized = mainWindow?.isMaximized();
    let size = mainWindow?.getSize();

    ipcMain.on(timerEventWrapper("start-timer"), async (event, arg) => {
        wasMaximized = mainWindow?.isMaximized();

        mainWindow?.unmaximize();
        size = mainWindow?.getSize();

        mainWindow?.setSize(200, 200);
        mainWindow?.setMenuBarVisibility(false);
        mainWindow?.setAlwaysOnTop(true, "pop-up-menu");
      
      });
      
    ipcMain.on(timerEventWrapper("end-timer"), async (event, arg) => {
        if (size) {
            mainWindow?.setSize(size[0], size[1]);
        } else {
            mainWindow?.setSize(1024, 768);
        }

        if (wasMaximized) {
            mainWindow?.maximize();
        }
        mainWindow?.setAlwaysOnTop(false);
    });
}