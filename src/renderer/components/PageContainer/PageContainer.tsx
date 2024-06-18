import styles from "./PageContainer.module.scss";
import Sidebar from "../Sidebar/Sidebar";
import { ReactNode } from "react";


export default function PageContainer({children, className} : {children? : ReactNode, className? : string}) {
    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <main className={className}>
                {children}
            </main>
        </div>
    );
}