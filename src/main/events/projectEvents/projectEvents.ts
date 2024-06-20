import { ipcMain } from "electron";
import {  readFile, writeFile } from "fs";
import { v4 as uuid } from "uuid";

const FILENAME : string = "projects.json";

export type Task = {
    title: string,
    timer: TimerState,
    complete: boolean
};

export type Project = {
    title: string,
    createdAt: Date | string,
    lastModified: Date | string,
    lastAccessed: Date | string,
    tasks: Task[]
};

export type Projects = {
    [key: string]: Project
};

function sendResponse(event: Electron.IpcMainEvent, title: string, response: ElectronResponse) {
    event.reply(title, response);
}


export default function registerProjectEvents() {
    ipcMain.on("create-project", async (event, title: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            let projects : Projects = {};
            if (!err) {
                projects = JSON.parse(data);
            }

            const projectId : string = uuid();
            const newProject : Project = {
                title,
                createdAt: new Date(),
                lastModified: new Date(),
                lastAccessed: new Date(),
                tasks: []
            }
            projects[projectId] = newProject;

            writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (werr) => {
                if (werr) {
                    sendResponse(event, "create-project", {
                        success: false,
                        error: werr
                    });

                } else {
                    sendResponse(event, "create-project", {
                        success: true,
                        data: projects
                    });
                }

            });
        });
    });

    ipcMain.on("edit-project", async (event, projectId: string, title?: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            let projects : Projects = {};
            if (!err) {
                projects = JSON.parse(data);
            }

            if (projectId in projects && title) {
                projects[projectId].title = title;
                projects[projectId] = {
                    ...projects[projectId],
                    lastModified: new Date()
                };

                writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (werr) => {
                    if (werr) {
                        const response : ElectronResponse = {
                            success: false,
                            error: werr
                        };
    
                        sendResponse(event, "edit-project", response);
                    } else {
                        sendResponse(event, "edit-project", {success: true, data: projects[projectId]});
                    }
    
                });

            } else if (!(projectId in projects)){
                const response : ElectronResponse = {
                    success: false,
                    error: new Error("Project does not exist.")
                };

                sendResponse(event, "edit-project", response);
            } else {
                sendResponse(event, "edit-project", {success: true, data: projects[projectId]});
            }
        });
    });

    ipcMain.on("delete-project", async (event, projectId: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            let projects : Projects = {};
            if (!err) {
                projects = JSON.parse(data);
            }

            if (projectId in projects) {
                delete projects[projectId];

                writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (werr) => {
                    if (werr) {
                        const response : ElectronResponse = {
                            success: false,
                            error: werr
                        };
    
                        sendResponse(event, "delete-project", response);
                    } else {
                        sendResponse(event, "delete-project", {success: true});
                    }
    
                });
                
            } else {
                sendResponse(event, "delete-project", {success: false, error: new Error("Project does not exist.")});
            }
        });

    });

    ipcMain.on("get-projects", async (event, ...args) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                const response : ElectronResponse = {
                    success: false,
                    error: err
                };

                sendResponse(event, "get-projects", response);
            } else {
                const projects : Projects = JSON.parse(data);
                const response : ElectronResponse = {
                    success: true,
                    data: projects
                };

                sendResponse(event, "get-projects", response);
            }
        });
    });

    ipcMain.on("get-project", async (event, projectId: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                const response : ElectronResponse = {
                    success: false,
                    error: err
                };

                sendResponse(event, "get-project", response);
            } else {
                const projects : Projects = JSON.parse(data);
                const response : ElectronResponse = {
                    success: true,
                    data: projects[projectId]
                };

                sendResponse(event, "get-project", response);
            }
        })
    });
}

