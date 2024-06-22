import { useEffect, useState } from "react";
import { Task } from "../../../../../main/events/projectEvents/projectEvents";
import PomGrid from "../../../../components/PomGrid/PomSetterGrid";
import styles from "./TaskForm.module.scss";
import Button from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";


interface TaskFormProps {
    isEdit: boolean,
    projectId: string,
    taskId?: number
}

const DEFAULT_TASK : Task = {
    title: "",
    timer: {
        pomCount: 1,
        pomTime: {
            hour: 0,
            minute: 25
        },
        breakTime: {
            hour: 0,
            minute: 5
        },
        longBreakTime: {
            hour: 0,
            minute: 15
        }
    }
};


export default function TaskForm({ isEdit, projectId, taskId }: TaskFormProps) {
    const [task, setTask] = useState<Task>(DEFAULT_TASK);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
            const getTask = window.electron.ipcRenderer.on("get-task", (response : ElectronResponse) => {
                if (response.success) {
                    setTask(response.data);
                }

                setLoading(false);
            });

            const editTask = window.electron.ipcRenderer.on("edit-task", (response : ElectronResponse) => {
                if (response.success) {
                    navigate(`/projects/${projectId}`);
                    setIsError(false);
                } else {
                    setIsError(true);
                }

                setLoading(false);
            });

            return () => {
                getTask();
                editTask();
            };
        } else {
            const createTask = window.electron.ipcRenderer.on("create-task", (response: ElectronResponse) => {
                console.log("Hello");
                if (response.success) {
                    navigate(`/projects/${projectId}`);
                    setIsError(false);
                } else {
                    setIsError(true);
                }

                setLoading(false);
            });

            return () => {
                createTask();
            };
        }
    }, []);

    useEffect(() => {
        if (isEdit) {
            window.electron.ipcRenderer.sendMessage("get-task", taskId);
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        if (isEdit) {
            window.electron.ipcRenderer.sendMessage("edit-task", taskId, task);
        } else {
            window.electron.ipcRenderer.sendMessage("create-task", projectId, task);
        }
    };

    return (
        <>
            <section className={styles.title}>
                <label htmlFor="taskTitle">
                    Task Name
                </label>
                <input 
                    type="text"
                    name="title"
                    id="taskTitle"
                    autoFocus
                    placeholder="Enter Task Name"
                    value={task.title}
                    onChange={e => setTask({...task, title: e.target.value})}
                />
            </section>
            <PomGrid value={task.timer} onChange={(timer) => setTask({...task, timer})}/>
            <section className={styles.submit}>
                <Button category="primary" onClick={_ => handleSave()} disabled={loading || !task.title.length}>
                    {   isError ? "An unexpected error occured. Please try again." 
                        :
                        isEdit ? "Save Changes" : "Create Task"
                    }
                </Button>
                <Button category="tertiary" onClick={_ => setTask({...task, timer: DEFAULT_TASK.timer})} disabled={loading}>
                    Reset Timer
                </Button>
                <Button category="tertiary" onClick={_ => navigate(-1)} disabled={loading}>
                    Cancel
                </Button>
            </section>
        </>
    );
}