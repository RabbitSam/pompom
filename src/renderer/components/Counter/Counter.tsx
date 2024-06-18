import Button from "../Button/Button";
import styles from "./Counter.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";


interface CounterProps {
    current: number,
    onIncrease: () => void,
    onDecrease: () => void,
    alt: string,
    orientation?: "vertical" | "horizontal",
    after?: string
};


export default function Counter({current, onIncrease, onDecrease, alt, orientation, after=""} : CounterProps) {
    const classes : string = `${styles.counter} ${orientation === "horizontal" ? styles.vertical : ""}`;

    return (
        <div className={classes}>
            <div className="visuallyHidden">{alt}</div>
            <Button category="tertiary" onClick={onIncrease}>
                <div className="visuallyHidden">Increase</div>
                <FontAwesomeIcon icon={faPlus} />
            </Button>
            <div className={styles.currentValue}>
                <div className="visuallyHidden">Current</div>
                {current < 10 ? `0${current}` : current}{after}
            </div>
            <Button category="tertiary" onClick={onDecrease}>
                <div className="visuallyHidden">Decrease</div>
                <FontAwesomeIcon icon={faMinus} />
            </Button>
        </div>
    );
}