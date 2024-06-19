import { createSlice } from '@reduxjs/toolkit';


interface TimerState {
  pomCount: number,
  pomTime: {
    hour: number,
    minute: number,
    second: number
  },
  breakTime: {
    hour: number,
    minute: number,
    second: number
  },
  longBreakTime: {
    hour: number,
    minute: number,
    second: number
  },
};

export const startedTimerSlice = createSlice({
  name: 'startedTimer',
  initialState: {
    pomCount: 1,
    pomTime: {
        hour: 0,
        minute: 25,
        second: 0
    },
    breakTime: {
        hour: 0,
        minute: 5,
        second: 0
    },
    longBreakTime: {
        hour: 0,
        minute: 15,
        second: 0
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
export const { setTimers } = startedTimerSlice.actions;
export const selectTimer = (state : {startedTimer: TimerState}) => state.startedTimer;

export default startedTimerSlice.reducer;