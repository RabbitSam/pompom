import { createSlice } from '@reduxjs/toolkit';



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
      let key: keyof typeof state;
      for (key in state) {
        state[key] = action.payload[key]
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTimers } = currentTimerSlice.actions;
export const selectTimer = (state : {currentTimer: TimerState}) => state.currentTimer;

export default currentTimerSlice.reducer;