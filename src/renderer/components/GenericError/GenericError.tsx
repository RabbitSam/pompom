import Button from "../Button/Button";
import styles from "./GenericError.module.scss";


export default function GenericError({ isError } : { isError: boolean }) {
    return (
        isError ?
        <>
            <div className={styles.error}>
                <p>
                    An unexpected error occurred. Please try again.
                </p>
                <Button category="primary" onClick={_ => window.location.reload()}>
                    Refresh
                </Button>
            </div>
        </>
        :
        <>
        </>
    );
}