import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./QuickPom.module.scss";
import Counter from "../components/Counter/Counter";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStopwatch, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTimers } from "../stores/currentTimer/currentTimerSlice";
import TimeSetter from "../components/TimeSetter/TimeSetter";


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

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // #region handlers
    const handleReset = () => {
        setPomCount(1);
        setPomTime(DEFAULT_POM_TIME);
        setBreakTime(DEFAULT_BREAK_TIME);
        setLongBreakTime(DEFAULT_LONG_BREAK_TIME);
    };

    const handleStart = () => {
        dispatch(setTimers({
            pomCount,
            pomTime,
            breakTime,
            longBreakTime
        }));

        navigate("/start-timer");
    };
    // #endregion



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
                <TimeSetter title={"Work Length"} value={pomTime} onChange={time => setPomTime(time)}/>
                <TimeSetter title={"Break Length"} value={breakTime} onChange={time => setBreakTime(time)}/>
                <TimeSetter title={"Long Break Length"} value={longBreakTime} onChange={time => setLongBreakTime(time)}/>

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
                    <Button category="primary" onClick={e => handleStart()}>
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