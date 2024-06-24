import { useEffect, useState } from "react";
import styles from "./PopupNotification.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


type PopupType = "error" | "success";

export default function PopupNotification() {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState<PopupType>("error");
    const [message, setMessage] = useState("An unexpected error occured. Please go back and try again.");


    useEffect(() => {
        const handleShow = ((e : CustomEvent) => {
            const { type, message } : {type: PopupType, message: string} = e.detail;
            
            setType(type);
            setMessage(message);

            setVisible(true);
        }) as EventListener;

        const handleHide = ((e: CustomEvent) => {
            setVisible(false);
        }) as EventListener;

        window.addEventListener("show-popup", handleShow);
        window.addEventListener("hide-popup", handleHide);

        return () => {
            window.removeEventListener("show-popup", handleShow);
            window.removeEventListener("hide-popup", handleHide);
        }
    }, []);

    return (
        <section className={`${styles.popupNotification} ${styles[`popupNotification${type}`]} ${visible ? styles.visible : ""}`} aria-hidden={!visible}>
            <div className={styles.title}>
                <div>{type === "error" ? "Error" : "Success"}</div>
                <button onClick={_ => setVisible(false)}>
                    <div className="visuallyHidden">Close Popup</div>
                    <FontAwesomeIcon icon={faXmark} width={20}/>
                </button>
            </div>
            <p>
                {message}
            </p>
        </section>
    );
}