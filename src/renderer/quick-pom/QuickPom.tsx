import PageContainer from "../components/PageContainer/PageContainer";
import styles from "./QuickPom.module.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStopwatch, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTimers } from "../stores/currentTimer/currentTimerSlice";
import PomSetterGrid from "../components/PomGrid/PomSetterGrid";


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
    const [timer, setTimer] = useState<TimerState>({
        pomCount: 1,
        pomTime: DEFAULT_POM_TIME,
        breakTime: DEFAULT_BREAK_TIME,
        longBreakTime: DEFAULT_LONG_BREAK_TIME
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // #region handlers
    const handleReset = () => {
        setTimer({
            pomCount: 1,
            pomTime: DEFAULT_POM_TIME,
            breakTime: DEFAULT_BREAK_TIME,
            longBreakTime: DEFAULT_LONG_BREAK_TIME
        });
    };

    const handleStart = () => {
        dispatch(setTimers(timer));

        navigate("/start-timer");
    };
    // #endregion


    return (
        <PageContainer className={styles.main}>
            <h1>
                <FontAwesomeIcon icon={faStopwatch} />&nbsp;
                Quick Pom
            </h1>
            <PomSetterGrid 
                value={timer}
                onChange={setTimer}
            />
            <section className={styles.submit}>
                <Button category="primary" onClick={e => handleStart()}>
                    <FontAwesomeIcon icon={faPlay}/>&nbsp;&nbsp;Start Pom
                </Button>
                <Button category="tertiary" onClick={_ => handleReset()}>
                    <FontAwesomeIcon icon={faRefresh}/>&nbsp;&nbsp;Reset
                </Button>
            </section>
        </PageContainer>
    );
}