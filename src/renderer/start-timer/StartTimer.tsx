import { MouseEventHandler, useEffect, useState } from "react";
import styles from "./StartTimer.module.scss";
import { faArrowLeft, faXmark, faPlay, faRefresh, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTimer } from "../stores/currentTimer/currentTimerSlice";

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

    const [isPaused, setIsPaused] = useState<boolean>(false);

    let intervalId : NodeJS.Timeout;

    useEffect(() => {
        //180x160
        window.electron.ipcRenderer.sendMessage("start-timer");
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
                        } else {
                            setPomTime(newPomTime);
                        }
                        break;
                    
                    case 1:
                        const newBreakTime = breakTime - 1;

                        if (newBreakTime === 0 && (timer.pomCount - pomsLeft) % 3 === 2) {
                            setBreakTime(convertToSeconds(timer.breakTime));

                            setCurrentStage(2);
                        } else if (newBreakTime === 0) {
                            setBreakTime(convertToSeconds(timer.breakTime));

                            console.log(pomTime)

                            setCurrentStage(0);
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


    const handleBack : MouseEventHandler<HTMLButtonElement> = (e) => {
        window.electron.ipcRenderer.sendMessage("end-timer");
        navigate("/quick-pom");
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
        setPomTime(convertToSeconds(timer.pomTime));
        setBreakTime(convertToSeconds(timer.breakTime));
        setLongBreakTime(convertToSeconds(timer.longBreakTime));
        setCurrentStage(0);
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button onClick={handleBack}>
                    <span className="visuallyHidden">Go Back</span>
                    <FontAwesomeIcon icon={faArrowLeft} width={20} height={20}/>
                </button>
                {
                    pomsLeft > 2 ?
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
                </button>
                <button className={styles.restartButton} onClick={handleRestart}>
                    <span className="visuallyHidden">Restart</span>
                    <FontAwesomeIcon icon={faRefresh} width={20} height={20}/>
                </button>
            </div>
        </div>
    );
}