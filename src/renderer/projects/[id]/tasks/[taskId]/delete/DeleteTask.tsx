import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PageContainer from "../../../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, MouseEventHandler } from "react";
import Button from "../../../../../components/Button/Button";
import styles from "./DeleteTask.module.scss";


export default function DeleteTask() {
    const navigate = useNavigate();
    const { projectId, taskId } = useParams();
    const [taskTitle, setTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const getTask = window.electron.ipcRenderer.on("get-task", (response : ElectronResponse) => {
            if (response.success) {
                setTaskTitle(response.data.title);
            }
        });

        const deleteTask = window.electron.ipcRenderer.on("delete-task", (response : ElectronResponse) => {
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
            deleteTask();
        }
    }, []);

    useEffect(() => {
        window.electron.ipcRenderer.sendMessage("get-task", taskId);
    }, []);

    const handleDelete : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        window.electron.ipcRenderer.sendMessage("delete-task", projectId, taskId);
    };

    return (
        <PageContainer className={styles.main}>
            <h1>
                <FontAwesomeIcon icon={faTrash}/> Delete Task
            </h1>
            <p>
                Are you sure you want to delete this task? <strong>This cannot be undone.</strong>
            </p>
            <p className={styles.taskTitle}>
                <strong>Task Name: {taskTitle}</strong>
            </p>
            <div className={styles.buttonsSection}>
                <Button category="secondary" onClick={_ => navigate(-1)} disabled={loading}>
                    No, Go Back
                </Button>
                <Button category="tertiary" onClick={handleDelete} disabled={loading}>
                    {
                        isError ?
                        "An unexpected error occured. Please try again."
                        :
                        "Delete Task"
                    }
                </Button>
            </div>
        </PageContainer>
    )
}