import { FormEventHandler, useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import styles from "./ProjectForm.module.scss";
import { useNavigate } from "react-router-dom";
import showGenericErrorPopup from "../utils/showGenericErrorPopup";
import Loading from "../../components/Loading/Loading";
import GenericError from "../../components/GenericError/GenericError";


interface ProjectFormProps {
    isEdit: boolean,
    projectId?: string,
}


export default function ProjectForm({isEdit, projectId}: ProjectFormProps) {
    const [projectTitle, setProjectTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEdit) {
            const createProject = window.electron.ipcRenderer.on("create-project", (response: ElectronResponse) => {
                if (response.success) {
                    navigate(`/projects/${response.data}`);
                    handleSuccess();
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
                } else {
                    handleUnexpectedError();
                }

                setLoading(false);
            });

            const editProject = window.electron.ipcRenderer.on("edit-project", (response: ElectronResponse) => {
                if (response.success) {
                    navigate(-1);
                    handleSuccess();
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
            setLoading(true);
            window.electron.ipcRenderer.sendMessage("get-project", projectId);
        }
    }, []);

    const handleUnexpectedError = () => {
        showGenericErrorPopup();
        setUnexpectedError(true);
    };

    const handleSuccess = () => {
        const event = new CustomEvent("show-popup", {detail: {
            type: "success",
            message: isEdit ? "Project edited successfully." : "Project created successfully"
        }});

        window.dispatchEvent(event);
    }

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
        <>
            <GenericError isError={unexpectedError}/>
            <Loading isLoading={loading}/>
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
                <Button category="primary" onClick={e => console.log(e)} type="submit" disabled={projectTitle.length === 0}>
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
                <Button category="tertiary" onClick={_ => navigate(-1)}>
                    Cancel
                </Button>
            </form>
        </>
    );
}