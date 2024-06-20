import PageContainer from "../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import styles from "./DeleteProject.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { MouseEventHandler, useEffect, useState } from "react";


export default function DeleteProject() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [projectTitle, setProjectTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const getProject = window.electron.ipcRenderer.on("get-project", (response : ElectronResponse) => {
            if (response.success) {
                setProjectTitle(response.data.title);
            }
        });

        const deleteProject = window.electron.ipcRenderer.on("delete-project", (response : ElectronResponse) => {
            if (response.success) {
                navigate("/projects");
                setIsError(false);
            } else {
                setIsError(true);
            }

            setLoading(false);
        });

        return () => {
            getProject();
            deleteProject();
        }
    }, []);

    useEffect(() => {
        window.electron.ipcRenderer.sendMessage("get-project", projectId);
    }, [])

    const handleDelete : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        window.electron.ipcRenderer.sendMessage("delete-project", projectId);
    };

    return (
        <PageContainer className={styles.main}>
            <h1>
                <FontAwesomeIcon icon={faTrash}/> Delete Project
            </h1>
            <p>
                Are you sure you want to delete this project? <strong>This cannot be undone.</strong>
            </p>
            <p className={styles.projectTitle}>
                <strong>Project Name: {projectTitle}</strong>
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
                        "Delete Project"
                    }
                </Button>
            </div>
        </PageContainer>
    );
}