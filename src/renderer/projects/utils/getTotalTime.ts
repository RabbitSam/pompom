export default function getTotalTime(timer: TimerState) : string {
    const numLongBreaks : number = Math.floor(timer.pomCount / 4);

    const totalPomMinutes : number = ((timer.pomTime.minute + timer.breakTime.minute) * timer.pomCount) + (timer.longBreakTime.minute * numLongBreaks);
    const finalHours = ((timer.pomTime.hour + timer.breakTime.hour) * timer.pomCount) + Math.floor(totalPomMinutes / 60) + (timer.longBreakTime.hour * numLongBreaks);
    const finalMinutes = totalPomMinutes % 60;

    return `${finalHours}h ${finalMinutes}m`;
}