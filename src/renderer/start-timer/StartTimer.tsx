import { MouseEventHandler, useEffect } from "react";
import styles from "./StartTimer.module.scss";
import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";


export default function StartTimer() {
    const navigate = useNavigate();

    useEffect(() => {
        //180x140
        window.electron.ipcRenderer.sendMessage("start-timer");
    }, []);

    const handleBack : MouseEventHandler<HTMLButtonElement> = (e) => {
        window.electron.ipcRenderer.sendMessage("end-timer");
        navigate("/quick-pom");
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeft} width={20} height={20}/>
                </button>
                <button onClick={e => window.electron.ipcRenderer.sendMessage("close")}>
                    <FontAwesomeIcon icon={faXmark} width={20} height={20} />
                </button>
            </div>
            <div>
                Helloefe
            </div>
        </div>
    );
}