import { ipcMain } from "electron";
import { mainWindow } from "../../main";
const fs = require("fs");

const FILENAME : string = "projects.json";

export default function registerProjectEvents() {
    ipcMain.on("create-task", async (event, [projectId, title]) => {

    });

    ipcMain.on("edit-task", async (event, [projectId, title, timerState]) => {

    });

    ipcMain.on("delete-task", async (event, [projectId, title, timerState]) => {

    });
}

