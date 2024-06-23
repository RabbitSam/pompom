import { ipcMain } from "electron";
import {  readFile, writeFile } from "fs";
import { v4 as uuid } from "uuid";
import { sendEventResponse } from "../../util";

export const FILENAME : string = "projects.json";

export type Task = {
    id: string,
    title: string,
    timer: TimerState,
    completedAt?: Date | string
};

export type Project = {
    id: string
    title: string,
    createdAt: Date | string,
    lastModified: Date | string,
    lastAccessed: Date | string,
    tasks: {
        completed: string[],
        current: string[]
    }
};

export type Projects = {
    [key: string]: Project
};

export type ProjectEvent = "create-project" | "edit-project" | "get-project" | "get-projects" | "delete-project";

// Wrapper to verify that project events are ensured.
function projectEventWrapper(projectEvent: ProjectEvent): ProjectEvent {
    return projectEvent;
}


export default function registerProjectEvents() {
    ipcMain.on(projectEventWrapper("create-project"), async (event, title: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            let projects : Projects = {};
            if (!err) {
                projects = JSON.parse(data);
            }

            const projectId : string = uuid();
            const newProject : Project = {
                id: projectId,
                title,
                createdAt: new Date(),
                lastModified: new Date(),
                lastAccessed: new Date(),
                tasks: {
                    completed: [],
                    current: []
                }
            };
            projects[projectId] = newProject;

            writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (werr) => {
                if (werr) {
                    sendEventResponse(event, projectEventWrapper("create-project"), {
                        success: false,
                        error: werr
                    });

                } else {
                    sendEventResponse(event, projectEventWrapper("create-project"), {
                        success: true,
                        data: projectId
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
                    lastModified: new Date(),
                };

                writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (werr) => {
                    if (werr) {
                        const response : ElectronResponse = {
                            success: false,
                            error: werr
                        };
    
                        sendEventResponse(event, projectEventWrapper("edit-project"), response);
                    } else {
                        sendEventResponse(event, projectEventWrapper("edit-project"), {success: true, data: projects[projectId]});
                    }
    
                });

            } else if (!(projectId in projects)){
                const response : ElectronResponse = {
                    success: false,
                    error: new Error("Project does not exist.")
                };

                sendEventResponse(event, projectEventWrapper("edit-project"), response);
            } else {
                sendEventResponse(event, projectEventWrapper("edit-project"), {success: true, data: projects[projectId]});
            }
        });
    });

    ipcMain.on(projectEventWrapper("delete-project"), async (event, projectId: string) => {
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
    
                        sendEventResponse(event, projectEventWrapper("delete-project"), response);
                    } else {
                        sendEventResponse(event, projectEventWrapper("delete-project"), {success: true});
                    }
    
                });
                
            } else {
                sendEventResponse(event, projectEventWrapper("delete-project"), {success: false, error: new Error("Project does not exist.")});
            }
        });

    });

    ipcMain.on(projectEventWrapper("get-projects"), async (event, ...args) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                const response : ElectronResponse = {
                    success: false,
                    error: err
                };

                sendEventResponse(event, projectEventWrapper("get-projects"), response);
            } else {
                const projects : Projects = JSON.parse(data);
                const response : ElectronResponse = {
                    success: true,
                    data: projects
                };

                sendEventResponse(event, projectEventWrapper("get-projects"), response);
            }
        });
    });

    ipcMain.on(projectEventWrapper("get-project"), async (event, projectId: string) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                const response : ElectronResponse = {
                    success: false,
                    error: err
                };

                sendEventResponse(event, projectEventWrapper("get-project"), response);
            } else {
                const projects : Projects = JSON.parse(data);
                if (projectId in projects) {
                    const response : ElectronResponse = {
                        success: true,
                        data: projects[projectId]
                    };

                    projects[projectId].lastAccessed = new Date();

                    writeFile(FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (err) => {
                        if (err) {
                            console.log("Error occurred when writing");
                        }
                    });

                    sendEventResponse(event, projectEventWrapper("get-project"), response);
                } else {
                    sendEventResponse(event, projectEventWrapper("get-project"), {
                        success: false,
                        error: new Error("Project doesn't exist")
                    });
                }
            }
        })
    });
}

