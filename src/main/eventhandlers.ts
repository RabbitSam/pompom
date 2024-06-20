import registerProjectEvents from "./events/projectEvents/projectEvents";
import registerTimerEvents from "./events/timerEvents";
import registerWindowButtonEvents from "./events/windowButtonEvents";

export default function registerEventHandlers() {
    registerTimerEvents();
    registerWindowButtonEvents();
    registerProjectEvents();
}