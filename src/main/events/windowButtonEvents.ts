import { ipcMain } from "electron";
import { mainWindow } from "../main";

function windowButtonEventWrapper(windowButtonEvent: WindowButtonEvent) : WindowButtonEvent {
    return windowButtonEvent;
}

export type WindowButtonEvent = "minimize" | "maximize" | "close";

export default function registerWindowButtonEvents() {
    ipcMain.on(windowButtonEventWrapper("minimize"), async (event, arg) => {
        mainWindow?.minimize();
    });
    
    ipcMain.on(windowButtonEventWrapper("maximize"), async (event, arg) => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });
    
    ipcMain.on(windowButtonEventWrapper("close"), async (event, arg) => {
        mainWindow?.close();
    });
}