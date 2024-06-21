import { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer/PageContainer";
import styles from "./ViewProject.module.scss";
import { Project, Task } from "../../../main/events/projectEvents/projectEvents";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ButtonLink } from "../../components/Button/Button";
import { v5 } from "uuid";
import formatDate from "../utils/formatDate";


const UUID_NAMESPACE : string = "fe653147-b00b-40e0-8cda-b6acf9361430";

const DEFAULT_PROJECT : Project = {
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

        return () => {
            getProject();
            getTasks();
        };
    }, []);

    useEffect(() => {
        window.electron.ipcRenderer.sendMessage("get-project", projectId);
        window.electron.ipcRenderer.sendMessage("get-tasks", projectId);
    }, []);

    return (
        <PageContainer className={styles.main}>
            <div className={styles.pageHeader}>
                <h1>
                    {project.title}
                </h1>
                <section className={styles.projectActions}>
                    <ButtonLink to={`/projects/${projectId}/edit`} category="tertiary">
                        <FontAwesomeIcon icon={faPenToSquare} width={20} height={20}/>
                        <div className="visuallyHidden">Edit Project</div>
                    </ButtonLink>
                    <ButtonLink to={`/projects/${projectId}/delete`} category="tertiary">
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
                            Mark as Complete
                        </div>
                        {
                            tasks.current.map(task => {
                                const key : string = v5(task.title, UUID_NAMESPACE);
                                return (
                                    <div className={styles.row} key={key}>
                                        <div className={styles.taskContent}>
                                            {task.title}
                                        </div>
                                        <div className={styles.taskContent}>
                                            {task.completedAt ? formatDate(task.completedAt) : "Error"}
                                        </div>
                                        <label htmlFor={key} className="visuallyHidden">
                                            Mark task as complete.
                                        </label>
                                        <input type="checkbox" name="complete" id={key} className={styles.marker} checked={false}/>
                                    </div>
                                );
                            })
                        }
                        {
                            !project.tasks.current.length && 
                                "No tasks yet."
                        }
                    </div>
                </section>
                <div className={styles.separator}></div>
                <section className={styles.completedTasks}>
                    <h2>
                        Completed
                    </h2>
                    <div className={styles.taskGrid}>
                        <div className={styles.header}>
                            Task Name
                        </div>
                        <div className={styles.header}>
                            Completed On
                        </div>
                        <div className={styles.header}>
                            Mark as Incomplete
                        </div>
                        {
                            tasks.completed.map(task => {
                                const key : string = v5(task.title, UUID_NAMESPACE);
                                return (
                                    <div className={styles.row} key={key}>
                                        <div className={styles.taskContent}>
                                            {task.title}
                                        </div>
                                        <div className={styles.taskContent}>
                                            {task.completedAt ? formatDate(task.completedAt) : "error"}
                                        </div>
                                        <label htmlFor={key} className="visuallyHidden">
                                            Mark task as incomplete.
                                        </label>
                                        <input type="checkbox" name="complete" id={key} className={styles.marker} checked={true}/>
                                    </div>
                                );
                            })
                        }
                        {
                            !project.tasks.completed.length && 
                                "No completed tasks yet."
                        }
                    </div>
                </section>
            </section>
        </PageContainer>
    )
}