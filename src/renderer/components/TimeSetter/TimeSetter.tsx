import Counter from "../Counter/Counter";
import styles from "./TimeSetter.module.scss";


interface PomTimeSetterProps {
    title: string,
    value: TimeState,
    onChange?: (value : TimeState) => void
}


export default function PomTimeSetter({ title, value, onChange } : PomTimeSetterProps) {
    const increment = (key: "hour" | "minute") : void => {
        const finalTime : TimeState = {...value};
        switch (key) {
            case "hour":
                finalTime.hour += 1;
                break;

            case "minute":
                if (finalTime.minute === 59) {
                    finalTime.hour += 1;
                    finalTime.minute = 0;
                } else {
                    finalTime.minute += 1;
                }
                break;

            default:
                break;
        }

        if (onChange) {
            onChange(finalTime);
        }
    };

    const decrement = (key: "hour" | "minute") : void => {
        const finalTime : TimeState = {...value};
        switch (key) {
            case "hour":
                finalTime.hour = Math.max(0, finalTime.hour - 1);
                finalTime.minute = finalTime.hour >= 1 ? finalTime.minute : Math.max(1, finalTime.minute);
                break;

            case "minute":
                if (finalTime.minute === 0 && finalTime.hour >= 1) {
                    finalTime.hour -= 1;
                    finalTime.minute = 59;
                } else {
                    finalTime.minute = Math.max(finalTime.hour >= 1 ? 0 : 1, finalTime.minute - 1);
                }
                break;

            default:
                break;
        }

        if (onChange) {
            onChange(finalTime);
        }
    };

    return (
        <section className={styles.timer}>
            <div className={styles.timerTitle}>{title}</div>
            <div className={styles.timeControls}>
                <Counter current={value.hour} alt={`${title} Hours`} after="h"
                    onIncrease={() => increment("hour")} 
                    onDecrease={() => decrement("hour")}
                />
                <div className={styles.separator}>:</div>
                <Counter current={value.minute} alt={`${title} Minutes`} after="m"
                    onIncrease={() => increment("minute")} 
                    onDecrease={() => decrement("minute")}
                />
            </div>
        </section>
    );
}