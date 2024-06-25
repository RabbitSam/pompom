import { MouseEventHandler, useEffect, useState } from "react";
import styles from "./StartTimer.module.scss";
import { faArrowLeft, faXmark, faPlay, faRefresh, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTimer } from "../stores/currentTimer/currentTimerSlice";
import Tooltip from "../components/Tooltip/Tooltip";


function convertToSeconds({hour, minute, second} : {hour: number, minute: number, second?: number}) : number {
    return (hour * 60 * 60) + (minute * 60) + (second ? second : 0);
}


function formatTime(seconds: number) : string {
    const finalSeconds : number = seconds % 60;
    const finalMinutes : number = Math.floor((seconds / 60)) % 60;
    const finalHours : number = Math.floor(seconds / (60 * 60));


    return `${finalHours}h ${finalMinutes}m ${finalSeconds}s`;
}

export default function StartTimer() {
    const navigate = useNavigate();
    const timer = useSelector(selectTimer);

    const [pomsLeft, setPomsLeft] = useState<number>(timer.pomCount);
    const [pomTime, setPomTime] = useState<number>(convertToSeconds(timer.pomTime));
    const [breakTime, setBreakTime] = useState<number>(convertToSeconds(timer.breakTime));
    const [longBreakTime, setLongBreakTime] = useState<number>(convertToSeconds(timer.longBreakTime));

    const [currentStage, setCurrentStage] = useState<number>(0);
    const [stageComplete, setStageComplete] = useState<boolean>(false);

    const [isPaused, setIsPaused] = useState<boolean>(false);

    let intervalId : NodeJS.Timeout;

    useEffect(() => {
        //180x160
        window.electron.ipcRenderer.sendMessage("start-timer");
        const event = new Event("hide-popup");

        window.dispatchEvent(event);
    }, []);

    useEffect(() => {
        if (pomsLeft && !isPaused) {
            intervalId = setInterval(() => {
                switch (currentStage) {
                    case 0:
                        const newPomTime = pomTime - 1;

                        if (newPomTime === 0) {
                            setPomTime(convertToSeconds(timer.pomTime));
                            setCurrentStage(1);
                            handleStageComplete();
                        } else {
                            setPomTime(newPomTime);
                        }
                        break;
                    
                    case 1:
                        const newBreakTime = breakTime - 1;

                        if (newBreakTime === 0 && (timer.pomCount - pomsLeft) % 4 === 3) {
                            setBreakTime(convertToSeconds(timer.breakTime));

                            setCurrentStage(2);
                            handleStageComplete();
                        } else if (newBreakTime === 0) {
                            setBreakTime(convertToSeconds(timer.breakTime));

                            console.log(pomTime)

                            setCurrentStage(0);
                            handleStageComplete();
                            setPomsLeft(pomsLeft - 1);
                        } else {
                            setBreakTime(newBreakTime);
                        }
                        break;
                    
                    case 2:
                        const newLongBreakTime = longBreakTime - 1;

                        if (newLongBreakTime === 0) {
                            setLongBreakTime(convertToSeconds(timer.longBreakTime));

                            setCurrentStage(0);
                            handleStageComplete();
                            setPomsLeft(pomsLeft - 1);
                        } else {
                            setLongBreakTime(newLongBreakTime);
                        }
                        break;
                
                    default:
                        break;
                }
            }, 1000);
        

            return () => clearInterval(intervalId);
        }
    }, [pomTime, breakTime, longBreakTime, pomsLeft, currentStage, isPaused]);

    const handleStageComplete = () => {
        setStageComplete(prev => !prev);

        setTimeout(() => {
            setStageComplete(false);
        }, 5000);
    };

    const handleBack : MouseEventHandler<HTMLButtonElement> = (e) => {
        window.electron.ipcRenderer.sendMessage("end-timer");
        navigate(-1);
    };

    const handlePause : MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!isPaused) {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        setIsPaused(!isPaused);
    };

    const handleRestart : MouseEventHandler<HTMLButtonElement> = (e) => {
        setPomsLeft(timer.pomCount);
        handleRestartCurrent(e);
    }

    const handleRestartCurrent : MouseEventHandler<HTMLButtonElement> = (e) => {
        setPomTime(convertToSeconds(timer.pomTime));
        setBreakTime(convertToSeconds(timer.breakTime));
        setLongBreakTime(convertToSeconds(timer.longBreakTime));
        setCurrentStage(0);
    }

    return (
        <div className={`${styles.pageContainer} ${stageComplete ? styles.stageComplete : ""}`}>
            <div className={styles.header}>
                <button onClick={handleBack}>
                    <span className="visuallyHidden">Go Back (Closes Pom)</span>
                    <FontAwesomeIcon icon={faArrowLeft} width={20} height={20}/>
                </button>
                {
                    pomsLeft >= 2 ?
                    <div className={styles.pomsLeft}>
                        Poms Left: {pomsLeft}
                    </div>
                    :
                    pomsLeft === 1 &&
                    <div className={styles.pomsLeft}>
                        Last Pom!
                    </div>
                }
                <button onClick={e => window.electron.ipcRenderer.sendMessage("close")}>
                    <span className="visuallyHidden">Close App</span>
                    <FontAwesomeIcon icon={faXmark} width={20} height={20} />
                </button>
            </div>
            {   
                pomsLeft > 0 ?
                <div className={styles.timerSection}>
                    {
                        currentStage === 0 &&
                            <>
                                <div>
                                    Get to Work
                                </div>
                                <div>
                                    {formatTime(pomTime)}
                                </div>
                            </>
                    }
                    {
                        currentStage === 1 &&
                            <>
                                <div>
                                    Take a Break!
                                </div>
                                <div>
                                    {formatTime(breakTime)}
                                </div>
                            </>
                    }
                    {
                        currentStage === 2 && 
                            <>
                                <div>
                                    Relax!
                                </div>
                                <div>
                                    {formatTime(longBreakTime)}
                                </div>
                            </>
                    }
                </div>
                :
                <div className={styles.finished}>
                    You've completed your poms!
                </div>
            }
            <div className={styles.buttons}>
                <button className={styles.playButton} onClick={handlePause}>
                    <span className="visuallyHidden">{isPaused ? "Play" : "Pause"}</span>
                    <FontAwesomeIcon icon={isPaused ? faPlay : faPause} width={20} height={20}/>
                    <Tooltip text={isPaused ? "Play" : "Pause"}/>
                </button>
                <button className={styles.restartButton} onClick={handleRestartCurrent}>
                    <span className="visuallyHidden">Restart Current Pom</span>
                    <svg className={styles.repeatOne} width={20} height={20} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} focusable={false} >
                        {/* <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
                        <path fill="currentColor" d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/><path stroke="currentColor" stroke-width="50" stroke-linecap="round" d="m260 320v-120"/><line stroke="currentColor" stroke-width="50" stroke-linecap="round" x1="220" y1="220" x2="260" y2="200"/>
                    </svg>
                    <Tooltip text="Restart Current Pom"/>
                </button>
                <button className={styles.restartButton} onClick={handleRestart}>
                    <span className="visuallyHidden">Restart</span>
                    <FontAwesomeIcon icon={faRefresh} width={20} height={20}/>
                    <Tooltip text="Restart"/>
                </button>
            </div>
        </div>
    );
}