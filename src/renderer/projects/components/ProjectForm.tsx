import { FormEventHandler, useState, useEffect } from "react";
import { Project } from "../../../main/events/projectEvents/projectEvents";
import Button from "../../components/Button/Button";
import styles from "./ProjectForm.module.scss";
import { useNavigate } from "react-router-dom";


interface ProjectFormProps {
    isEdit: boolean,
    projectId?: string,
}


export default function ProjectForm({isEdit, projectId}: ProjectFormProps) {
    const [projectTitle, setProjectTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEdit) {
            const createProject = window.electron.ipcRenderer.on("create-project", (response: ElectronResponse) => {
                if (response.success) {
                    navigate("/projects");
                    setIsError(false);
                } else {
                    setIsError(true);
                }

                setLoading(false);
            });

            return () => {
                createProject();
            };
        } else {
            const getProject = window.electron.ipcRenderer.on("get-project", (response: ElectronResponse) => {
                if (response.success) {
                    setProjectTitle(response.data.title);
                }
            });

            const editProject = window.electron.ipcRenderer.on("edit-project", (response: ElectronResponse) => {
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
                editProject();
            };
        }
    }, []);

    useEffect(() => {
        if (isEdit) {
            window.electron.ipcRenderer.sendMessage("get-project", projectId);
        }
    }, []);

    const handleSubmit : FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isEdit) {
            window.electron.ipcRenderer.sendMessage("create-project", projectTitle);
        } else {
            window.electron.ipcRenderer.sendMessage("edit-project", projectId, projectTitle);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="projectTitle">
                Project Name
            </label>
            <input 
                type="text"
                name="title"
                id="projectTitle"
                autoFocus
                placeholder="Enter Project Name"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
            />
            <Button category="primary" onClick={e => console.log(e)} type="submit" disabled={loading || projectTitle.length === 0}>
                {
                    isError 
                    ? 
                    "An error occured. Please try again." 
                    :
                    <>
                        Submit {isEdit ? "Changes" : ""}
                    </>
                }
            </Button>
            <Button category="tertiary" onClick={_ => navigate(-1)} disabled={loading}>
                Cancel
            </Button>
        </form>
    );
}