import styles from "./Loading.module.scss";
import logo from "../../../../assets/icon.png";


export default function Loading({ isLoading } : { isLoading: boolean }) {


    return (
        isLoading ?
        <div className={styles.loading} aria-description="Loading...">
            <div className={styles.background}></div>
            <img className={styles.icon} src={logo} alt="Loading symbol."/>
            <div className={styles.description}>Loading...</div>
        </div>
        :
        <>
        </>
    );
}