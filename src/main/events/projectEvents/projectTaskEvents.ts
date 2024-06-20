import { ipcMain } from "electron";
import { mainWindow } from "../../main";
const fs = require("fs");

const FILENAME : string = "projects.json";

export default function registerProjectEvents() {
    ipcMain.on("create-task", async (event, projectId: string, title: string, timerState : TimerState) => {

    });

    ipcMain.on("edit-task", async (event, projectId: string, taskIndex: number, title: string, timerState : TimerState, complete: boolean) => {

    });

    ipcMain.on("delete-task", async (event, projectId: string, taskIndex: number) => {

    });

    ipcMain.on("get-task", async (event, projectId: string, taskIndex: number) => {

    });
}