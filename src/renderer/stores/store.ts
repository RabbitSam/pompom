import { configureStore } from '@reduxjs/toolkit';
import currentTimerReducer from './currentTimer/currentTimerSlice';
import startedTimerReducer from './startedTimer/startedTimerSlice';


export default configureStore({
    reducer: {
        currentTimer: currentTimerReducer,
        startedTimer: startedTimerReducer
    }
});