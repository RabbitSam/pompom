import { createSlice } from '@reduxjs/toolkit';


type TimerType = "pom" | "break" | "longBreak";
type TimeKey = "hour" | "minute";

interface TimerState {
  pomCount: number,
  pomTime: {
    hour: number,
    minute: number
  },
  breakTime: {
    hour: number,
    minute: number
  },
  longBreakTime: {
    hour: number,
    minute: number
  },
};

export const currentTimerSlice = createSlice({
  name: 'currentTimer',
  initialState: {
    pomCount: 1,
    pomTime: {
        hour: 0,
        minute: 25
    },
    breakTime: {
        hour: 0,
        minute: 5
    },
    longBreakTime: {
        hour: 0,
        minute: 15
    },
  },
  reducers: {
    setTimers: (state, action) => {
      state = {
        ...action.payload
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTimers } = currentTimerSlice.actions;
export const selectTimer = (state : {currentTimer: TimerState}) => state.currentTimer;

export default currentTimerSlice.reducer;