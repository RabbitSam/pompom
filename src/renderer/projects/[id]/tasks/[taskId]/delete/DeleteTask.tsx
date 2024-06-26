import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PageContainer from "../../../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, MouseEventHandler } from "react";
import Button from "../../../../../components/Button/Button";
import styles from "./DeleteTask.module.scss";
import showGenericErrorPopup from "../../../../utils/showGenericErrorPopup";
import Loading from "../../../../../components/Loading/Loading";
import GenericError from "../../../../../components/GenericError/GenericError";


export default function DeleteTask() {
    const navigate = useNavigate();
    const { projectId, taskId } = useParams();
    const [taskTitle, setTaskTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);

    useEffect(() => {
        const getTask = window.electron.ipcRenderer.on("get-task", (response : ElectronResponse) => {
            if (response.success) {
                setTaskTitle(response.data.title);
            } else {
                showGenericErrorPopup();
                setUnexpectedError(true);
            }

            setLoading(false);
        });

        const deleteTask = window.electron.ipcRenderer.on("delete-task", (response : ElectronResponse) => {
            if (response.success) {
                navigate(`/projects/${projectId}`);
                setIsError(false);

                const event = new CustomEvent("show-popup", {
                    detail: {
                        type: "success",
                        message: "Task deleted successfully."        
                    }
                });

                window.dispatchEvent(event);

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
        setLoading(true);
        window.electron.ipcRenderer.sendMessage("delete-task", projectId, taskId);
    };

    return (
        <PageContainer className={styles.main}>
            <GenericError isError={unexpectedError}/>
            <Loading isLoading={loading}/>
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
                <Button category="secondary" onClick={_ => navigate(-1)}>
                    No, Go Back
                </Button>
                <Button category="tertiary" onClick={handleDelete}>
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