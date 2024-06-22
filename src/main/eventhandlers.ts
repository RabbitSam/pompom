import registerProjectEvents from "./events/projectEvents/projectEvents";
import registerTaskEvents from "./events/projectEvents/projectTaskEvents";
import registerTimerEvents from "./events/timerEvents";
import registerWindowButtonEvents from "./events/windowButtonEvents";

export default function registerEventHandlers() {
    registerTimerEvents();
    registerWindowButtonEvents();
    registerProjectEvents();
    registerTaskEvents();
}