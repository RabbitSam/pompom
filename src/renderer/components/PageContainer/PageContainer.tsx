import styles from "./PageContainer.module.scss";
import Sidebar from "../Sidebar/Sidebar";
import { ReactNode } from "react";
import { faXmark, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function PageContainer({children, className} : {children? : ReactNode, className? : string}) {
    return (
        <div className={styles.pageParent}>
            <div className={styles.titleBar}>
                <div className={styles.title}>
                    Pompom
                </div>
                <div className={styles.titleButtons}>
                    <button onClick={e => window.electron.ipcRenderer.sendMessage("minimize")}>
                        <FontAwesomeIcon icon={faMinus} width={20} height={20}/>
                    </button>
                    <button onClick={e => window.electron.ipcRenderer.sendMessage("maximize")}>
                        <FontAwesomeIcon icon={faSquare} width={20} height={20}/>
                    </button>
                    <button onClick={e => window.electron.ipcRenderer.sendMessage("close")}>
                        <FontAwesomeIcon icon={faXmark} width={20} height={20} />
                    </button>
                </div>
            </div>
            <div className={styles.pageContainer}>
                <Sidebar />
                <main className={className}>
                    {children}
                </main>
            </div>
        </div>
    );
}