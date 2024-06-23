import { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer/PageContainer";
import styles from "./ViewProject.module.scss";
import { Project, Task } from "../../../main/events/projectEvents/projectEvents";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faCheckSquare, faPlay, faCheck, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import Button, { ButtonLink } from "../../components/Button/Button";
import { v5 } from "uuid";
import formatDate from "../utils/formatDate";
import { useDispatch } from "react-redux";
import { setTimers } from "../../stores/currentTimer/currentTimerSlice";
import getTotalTime from "../utils/getTotalTime";
import Tooltip from "../../components/Tooltip/Tooltip";


const UUID_NAMESPACE : string = "fe653147-b00b-40e0-8cda-b6acf9361430";

const DEFAULT_PROJECT : Project = {
    id: "",
    title: "",
    createdAt: "",
    lastAccessed: "",
    lastModified: "",
    tasks: {
        current: [],
        completed: []
    }
};

interface Tasks {
    current: Task[],
    completed: Task[]
};


export default function ViewProject() {
    const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
    const [tasks, setTasks] = useState<Tasks>({current: [], completed: []})
    const { projectId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getProject = window.electron.ipcRenderer.on("get-project", (response: ElectronResponse) => {
            if (response.success) {
                setProject(response.data);
            }
        });

        const getTasks = window.electron.ipcRenderer.on("get-tasks", (response: ElectronResponse) => {
            if (response.success) {
                setTasks(response.data);
            }
        });

        const setTaskCompletionStatus = window.electron.ipcRenderer.on("set-task-completion-status", (response: ElectronResponse) => {
            if (response.success) {
                loadProject();
            }
        });

        return () => {
            getProject();
            getTasks();
            setTaskCompletionStatus();
        };
    }, []);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = () => {
        window.electron.ipcRenderer.sendMessage("get-project", projectId);
        window.electron.ipcRenderer.sendMessage("get-tasks", projectId);
    };

    const handlePlay = (task: Task) => {
        dispatch(setTimers(task.timer));

        navigate("/start-timer");
    };

    const handleSetCompletionStatus = (taskId: string, isComplete: boolean) => {
        window.electron.ipcRenderer.sendMessage("set-task-completion-status", projectId, taskId, isComplete);
    };

    return (
        <PageContainer className={styles.main}>
            <div className={styles.pageHeader}>
                <h1>
                    {project.title}
                </h1>
                <section className={styles.projectActions}>
                    <ButtonLink to={`/projects/${projectId}/edit`} category="tertiary" tooltip="Edit Project">
                        <FontAwesomeIcon icon={faPenToSquare} width={20} height={20}/>
                        <div className="visuallyHidden">Edit Project</div>
                    </ButtonLink>
                    <ButtonLink to={`/projects/${projectId}/delete`} category="tertiary" tooltip="Delete Project">
                        <FontAwesomeIcon icon={faTrash} width={20} height={20}/>
                        <div className="visuallyHidden">Delete Project</div>
                    </ButtonLink>
                </section>
            </div>
            <section className={styles.projectTaskActions}>
                <ButtonLink to={`/projects/${projectId}/tasks/create`} category="primary">
                    <FontAwesomeIcon icon={faPlus}/> Create Task
                </ButtonLink>
            </section>
            <section className={styles.tasks}>
                <section className={styles.currentTasks}>
                    <h2>
                        Tasks
                    </h2>
                    <div className={styles.taskGrid}>
                        <div className={styles.headerRow}>
                            <div className={styles.header}>
                                Task Name
                            </div>
                            <div className={styles.header}>
                                Pomodoros
                            </div>
                            <div className={styles.header}>
                                Total Time
                            </div>
                            <div className={styles.header}>
                                Actions
                            </div>
                        </div>
                        {
                            tasks.current.map(task => (
                                    <div className={styles.row} key={task.id}>
                                        <div className={styles.taskContent}>
                                            <button className={styles.play} onClick={_ => handlePlay(task)}>
                                                <div className="visuallyHidden">Start Pomodoro</div>
                                                <FontAwesomeIcon icon={faPlay} width={20} height={20}/>
                                                <Tooltip text="Start Pomodoro"/>
                                            </button>
                                            <div>
                                                {task.title}
                                            </div>
                                        </div>
                                        <div className={styles.taskContent}>
                                            {task.timer.pomCount}
                                        </div>
                                        <div className={styles.taskContent}>
                                            {getTotalTime(task.timer)}
                                        </div>
                                        <div className={styles.taskAction}>
                                            <ButtonLink category="tertiary" to={`/projects/${projectId}/tasks/${task.id}/edit`} tooltip="Edit Task">
                                                <div className="visuallyHidden">Edit Task</div>
                                                <FontAwesomeIcon icon={faPenToSquare} width={20}/>
                                            </ButtonLink>
                                            <ButtonLink category="tertiary" to={`/projects/${projectId}/tasks/${task.id}/delete`} tooltip="Delete Task">
                                                <div className="visuallyHidden">Delete Task</div>
                                                <FontAwesomeIcon icon={faTrash} width={20}/>
                                            </ButtonLink>
                                            <Button category="secondary" onClick={_ => handleSetCompletionStatus(task.id, true)} tooltip={"Mark as Complete"}>
                                                <div className="visuallyHidden">Mark as Complete</div>
                                                <FontAwesomeIcon icon={faCheckCircle} width={20}/>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            )
                        }
                        {
                            !project.tasks.current.length && 
                                <div>
                                    <div className={styles.taskContent}>No tasks yet.</div>
                                </div>
                        }
                    </div>
                </section>
                <div className={styles.separator}></div>
                <section className={styles.completedTasks}>
                    <h2>
                        Completed
                    </h2>
                    <div className={styles.taskGrid}>
                        <div className={styles.row}>
                            <div className={styles.header}>
                                Task Name
                            </div>
                            <div className={styles.header}>
                                Completed On
                            </div>
                            <div className={styles.header}>
                                Actions
                            </div>
                        </div>
                        {
                            tasks.completed.map(task => (
                                <div className={styles.row} key={task.id}>
                                    <div className={styles.taskContent}>
                                        {task.title}
                                    </div>
                                    <div className={styles.taskContent}>
                                        {task.completedAt ? formatDate(task.completedAt) : "error"}
                                    </div>
                                    <div className={styles.taskAction}>
                                        <Button category="tertiary" onClick={_ => handleSetCompletionStatus(task.id, false)} tooltip="Mark as Incomplete">
                                            <div className="visuallyHidden">Mark as Incomplete</div>
                                            <FontAwesomeIcon icon={faXmarkCircle} width={20}/>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            !project.tasks.completed.length && 
                                <div>
                                    <div className={styles.taskContent}>No completed tasks yet.</div>
                                </div>
                        }
                    </div>
                </section>
            </section>
        </PageContainer>
    )
}