import { ipcMain } from "electron";
import { mainWindow } from "../main";


export default function registerWindowButtonEvents() {
    ipcMain.on("minimize", async (event, arg) => {
        mainWindow?.minimize();
    });
    
    ipcMain.on("maximize", async (event, arg) => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });
    
    ipcMain.on("close", async (event, arg) => {
        mainWindow?.close();
    });
}