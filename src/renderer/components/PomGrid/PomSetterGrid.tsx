import TimeSetter from "../TimeSetter/TimeSetter";
import styles from "./PomSetterGrid.module.scss";
import Counter from "../Counter/Counter";


interface PomGridProps {
    value: TimerState,
    onChange: (timer : TimerState) => void,
}


export default function PomGrid({ value, onChange }: PomGridProps) {
    const numLongBreaks : number = Math.floor(value.pomCount / 5);

    const totalPomMinutes : number = ((value.pomTime.minute + value.breakTime.minute) * value.pomCount) + (value.longBreakTime.minute * numLongBreaks);
    const finalHours = ((value.pomTime.hour + value.breakTime.hour) * value.pomCount) + Math.floor(totalPomMinutes / 60) + (value.longBreakTime.hour * numLongBreaks);
    const finalMinutes = totalPomMinutes % 60;

    return (
        <div className={styles.timers}>
            <TimeSetter 
                title={"Work Length"}
                value={value.pomTime}
                onChange={pomTime => onChange({...value, pomTime})}
            />
            <TimeSetter
                title={"Break Length"}
                value={value.breakTime}
                onChange={breakTime => onChange({...value, breakTime})}
            />
            <TimeSetter
                title={"Long Break Length"}
                value={value.longBreakTime}
                onChange={longBreakTime => onChange({...value, longBreakTime})}
            />

            <section className={`${styles.timeSection} ${styles.pomodoros}`}>
                <div className={styles.sectionTitle}>Pomodoros</div>
                <div> 
                    <Counter current={value.pomCount} alt="Pomodoros"
                        onIncrease={() => onChange({...value, pomCount: value.pomCount + 1})} 
                        onDecrease={() => onChange({...value, pomCount: Math.max(value.pomCount - 1, 1)})}
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
        </div>
    );
}