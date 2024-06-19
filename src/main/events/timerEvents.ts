import { ipcMain } from "electron";
import { mainWindow } from "../main";


export default function registerTimerEvents() {
    ipcMain.on("start-timer", async (event, arg) => {
        mainWindow?.unmaximize();
        mainWindow?.setSize(200, 200);
        mainWindow?.setMenuBarVisibility(false);
        mainWindow?.setAlwaysOnTop(true);
      
      });
      
    ipcMain.on("end-timer", async (event, arg) => {
        mainWindow?.setSize(1024, 768);
        mainWindow?.maximize();
        mainWindow?.setAlwaysOnTop(false);
    });
}