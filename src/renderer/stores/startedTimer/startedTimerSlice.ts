import { createSlice } from '@reduxjs/toolkit';


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