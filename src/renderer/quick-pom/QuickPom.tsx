import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./QuickPom.module.scss";
import Counter from "../components/Counter/Counter";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStopwatch, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button/Button";


interface TimeState {
    hour: number,
    minute: number
};

const DEFAULT_POM_TIME: TimeState = {
    hour: 0,
    minute: 25
};

const DEFAULT_BREAK_TIME: TimeState = {
    hour: 0,
    minute: 5
};

const DEFAULT_LONG_BREAK_TIME: TimeState = {
    hour: 0,
    minute: 15
};


export default function QuickPom() {
    const [pomCount, setPomCount] = useState<number>(1);

    const [pomTime, setPomTime] = useState<TimeState>(DEFAULT_POM_TIME);

    const [breakTime, setBreakTime] = useState<TimeState>(DEFAULT_BREAK_TIME);

    const [longBreakTime, setLongBreakTime] = useState<TimeState>(DEFAULT_LONG_BREAK_TIME);

    const increment = (time: TimeState, key: "hour" | "minute") : TimeState => {
        const finalTime : TimeState = {...time};
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

        return finalTime;
    };

    const decrement = (time: TimeState, key: "hour" | "minute") : TimeState => {
        const finalTime : TimeState = {...time};
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

        return finalTime;
    };

    const handleTimeChange = (time : "pom" | "break" | "longBreak", key : "hour" | "minute", isIncrease : boolean) => {
        switch (time) {
            case "pom":
                setPomTime(isIncrease ? increment(pomTime, key) : decrement(pomTime, key));
                break;

            case "break":
                setBreakTime(isIncrease ? increment(breakTime, key) : decrement(breakTime, key));
                break;
            
            case "longBreak":
                setLongBreakTime(isIncrease ? increment(longBreakTime, key) : decrement(longBreakTime, key));
                break;
        
            default:
                break;
        }
    };

    const handleReset = () => {
        setPomCount(1);
        setPomTime(DEFAULT_POM_TIME);
        setBreakTime(DEFAULT_BREAK_TIME);
        setLongBreakTime(DEFAULT_LONG_BREAK_TIME);
    };

    const numLongBreaks : number = Math.floor(pomCount / 4);

    const totalPomMinutes : number = ((pomTime.minute + breakTime.minute) * pomCount) + (longBreakTime.minute * numLongBreaks);
    const finalHours = ((pomTime.hour + breakTime.hour) * pomCount) + Math.floor(totalPomMinutes / 60) + (longBreakTime.hour * numLongBreaks);
    const finalMinutes = totalPomMinutes % 60;


    return (
        <PageContainer className={styles.main}>
            <h1>
                <FontAwesomeIcon icon={faStopwatch} />&nbsp;
                Quick Pom
            </h1>
            <div className={styles.timers}>
                <section className={styles.timeSection}>
                    <div className={styles.sectionTitle}>Work Length</div>
                    <div className={styles.timeControls}>
                        <Counter current={pomTime.hour} alt="Work Hours" after="h"
                            onIncrease={() => handleTimeChange("pom", "hour", true)} 
                            onDecrease={() => handleTimeChange("pom", "hour", false)}
                        />
                        <div className={styles.separator}>:</div>
                        <Counter current={pomTime.minute} alt="Work Minutes" after="m"
                            onIncrease={() => handleTimeChange("pom", "minute", true)} 
                            onDecrease={() => handleTimeChange("pom", "minute", false)}
                        />
                    </div>
                </section>

                <section className={styles.timeSection}>
                    <div className={styles.sectionTitle}>Break Length</div>
                    <div className={styles.timeControls}>
                        <Counter current={breakTime.hour} alt="Break Hours" after="h"
                            onIncrease={() => handleTimeChange("break", "hour", true)} 
                            onDecrease={() => handleTimeChange("break", "hour", false)}
                        />
                        <div className={styles.separator}>:</div>
                        <Counter current={breakTime.minute} alt="Break Minutes" after="m"
                            onIncrease={() => handleTimeChange("break", "minute", true)} 
                            onDecrease={() => handleTimeChange("break", "minute", false)}
                        />
                    </div>
                </section>

                <section className={styles.timeSection}>
                    <div className={styles.sectionTitle}>Long Break Length</div>
                    <div className={styles.timeControls}>
                        <Counter current={longBreakTime.hour} alt="Long Break Hours" after="h"
                            onIncrease={() => handleTimeChange("longBreak", "hour", true)} 
                            onDecrease={() => handleTimeChange("longBreak", "hour", false)}
                        />
                        <div className={styles.separator}>:</div>
                        <Counter current={longBreakTime.minute} alt="Long Break Minutes" after="m"
                            onIncrease={() => handleTimeChange("longBreak", "minute", true)} 
                            onDecrease={() => handleTimeChange("longBreak", "minute", false)}
                        />
                    </div>
                </section>

                <section className={`${styles.timeSection} ${styles.pomodoros}`}>
                    <div className={styles.sectionTitle}>Pomodoros</div>
                    <div> 
                        <Counter current={pomCount} alt="Pomodoros"
                            onIncrease={() => setPomCount(pomCount + 1)} 
                            onDecrease={() => setPomCount(Math.max(pomCount - 1, 1))}
                            orientation="horizontal"
                        />
                    </div>
                </section>

                
                <section className={styles.timeFinal}>
                    <div>
                        Total Time: {finalHours}h {finalMinutes}m
                    </div>
                    {
                        numLongBreaks > 0 &&
                        <div>
                            Includes {numLongBreaks} long break(s).
                        </div>
                    }
                </section>

                <section className={styles.submit}>
                    <Button category="primary" onClick={e => console.log(e)}>
                        <FontAwesomeIcon icon={faPlay}/>&nbsp;&nbsp;Start Pom
                    </Button>
                    <Button category="tertiary" onClick={_ => handleReset()}>
                        <FontAwesomeIcon icon={faRefresh}/>&nbsp;&nbsp;Reset
                    </Button>
                </section>
            </div>
        </PageContainer>
    );
}