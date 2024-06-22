import { ipcMain } from "electron";
import { readFile, rename, unlink, writeFile } from "fs";
import { FILENAME as PROJECT_FILENAME, Projects, Task, Project } from "./projectEvents";
import { sendEventResponse } from "../../util";
import { v4 as uuid } from "uuid";

const FILENAME : string = "tasks.json";
const TEMP_TASKS_FILENAME : string = `temp-${FILENAME}`;

interface Tasks {
    [key: string]: Task
}

function deleteTempFile(filename: string) {
    unlink(filename, (err) => {
        if (err) {
            console.log("Couldn't do this either. :/");
        }
    });
}

// Wrapper to ensure that task events are being used.
function taskEventWrapper(taskEvent : TaskEvent): TaskEvent {
    return taskEvent;
}

export type TaskEvent = "create-task" | "edit-task" | "delete-task" | "get-tasks" | "get-task" | "set-task-completion-status";

export default function registerProjectEvents() {
    ipcMain.on(taskEventWrapper("create-task"), async (event, projectId: string, newTask : Task) => {
        // Read tasks file
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            let tasks : Tasks = {};
            if (!err) {
                tasks = JSON.parse(data);
            }

            const taskId : string = uuid();
            tasks[taskId] = newTask;

            // Doing this transactionally with possible rollback, so we're writing to a temp file first.
            writeFile(TEMP_TASKS_FILENAME, JSON.stringify(tasks), {encoding: "utf-8"}, (err) => {
                if (err) {
                    sendEventResponse(event, taskEventWrapper("create-task"), {
                        success: false,
                        error: new Error("Failed to create temp task file.")
                    });
                } else {
                    // Read projects file
                    readFile(PROJECT_FILENAME, {encoding: "utf-8"}, (err, projectData) => {
                        if (err) {
                            // Delete temp tasks if things go wrong
                            deleteTempFile(TEMP_TASKS_FILENAME);
                            sendEventResponse(event, taskEventWrapper("create-task"), {
                                success: false,
                                error: new Error("Failed to read projects file.")
                            });
                        } else {
                            const projects : Projects = JSON.parse(projectData);
                            projects[projectId].tasks.current.push(taskId);

                            // Write to projects
                            writeFile(PROJECT_FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (err) => {
                                if (err) {
                                    deleteTempFile(TEMP_TASKS_FILENAME);
                                    sendEventResponse(event, taskEventWrapper("create-task"), {
                                        success: false,
                                        error: new Error("Failed to write to projects file.")
                                    });
                                } else {
                                    // Rename temp tasks to tasks
                                    rename(TEMP_TASKS_FILENAME, FILENAME, (err) => {
                                        if (err) {
                                            sendEventResponse(event, taskEventWrapper("create-task"), {
                                                success: false,
                                                error: new Error("Failed to rename tasks file.")
                                            });
                                        } else {
                                            sendEventResponse(event, taskEventWrapper("create-task"), {
                                                success: true,
                                                data: taskId
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    ipcMain.on(taskEventWrapper("edit-task"), async (event, taskId: string, task: Task) => {
        readFile(FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                sendEventResponse(event, taskEventWrapper("edit-task"), {
                    success: false,
                    error: new Error("Failed to open tasks file.")
                });
            } else {
                const tasks : Tasks = JSON.parse(data);
                if (taskId in tasks) {
                    tasks[taskId] = task;

                    writeFile(FILENAME, JSON.stringify(tasks), {encoding: "utf-8"}, (err) => {
                        if (err) {
                            sendEventResponse(event, taskEventWrapper("edit-task"), {
                                success: false,
                                error: new Error("Failed to write to tasks file.")
                            });
                        } else {
                            sendEventResponse(event, taskEventWrapper("edit-task"), {
                                success: true,
                                data: taskId
                            });
                        }
                    });

                } else {
                    sendEventResponse(event, taskEventWrapper("edit-task"), {
                        success: false,
                        error: new Error("Task does not exist.")
                    }); 
                }
            }
        });
    });

    ipcMain.on(taskEventWrapper("delete-task"), async (event, projectId: string, taskId: string) => {
        
    });

    ipcMain.on(taskEventWrapper("get-task"), async (event, projectId: string, taskId: string) => {

    });

    ipcMain.on(taskEventWrapper("get-tasks"), async (event, projectId: string) => {

    });

    ipcMain.on(taskEventWrapper("set-task-completion-status"), async (event, projectId: string, taskId: string, isComplete: boolean) => 
        readFile(PROJECT_FILENAME, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                    success: false,
                    error: new Error("Couldn't open project file")
                });
            } else {
                const projects : Projects = JSON.parse(data);
                const currentProject : Project = projects[projectId];
                if (isComplete) {
                    currentProject.tasks.current = projects[projectId].tasks.current.filter((item) => item !== taskId);
                    currentProject.tasks.completed.push(taskId);
                } else {
                    currentProject.tasks.completed = projects[projectId].tasks.completed.filter((item) => item !== taskId);
                    currentProject.tasks.current.push(taskId);
                }

                projects[projectId] = currentProject;

                const TEMP_PROJECT_FILENAME : string = `temp-${PROJECT_FILENAME}`;

                writeFile(TEMP_PROJECT_FILENAME, JSON.stringify(projects), {encoding: "utf-8"}, (err) => {
                    if (err) {
                        sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                            success: false,
                            error: new Error("Couldn't create temp projects file.")
                        });
                    } else {
                        readFile(FILENAME, {encoding: "utf-8"}, (err, tasksData) => {
                            if (err) {
                                deleteTempFile(TEMP_PROJECT_FILENAME);
                                sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                                    success: false,
                                    error: new Error("Couldn't open tasks file.")
                                });
                            } else {
                                const tasks : Tasks = JSON.parse(tasksData);
                                tasks[taskId].completedAt = new Date();

                                writeFile(FILENAME, JSON.stringify(tasks), {encoding: "utf-8"}, err => {
                                    if (err) {
                                        deleteTempFile(TEMP_PROJECT_FILENAME);
                                        sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                                            success: false,
                                            error: new Error("Couldn't write to tasks file.")
                                        });
                                    } else {
                                        rename(TEMP_PROJECT_FILENAME, PROJECT_FILENAME, (err) => {
                                            if (err) {
                                                sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                                                    success: false,
                                                    error: new Error("Failed to rename tasks file.")
                                                });
                                            } else {
                                                sendEventResponse(event, taskEventWrapper("set-task-completion-status"), {
                                                    success: true,
                                                    data: taskId
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    );
}