import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }

  interface TimerState {
    pomCount: number,
    pomTime: {
      hour: number,
      minute: number,
      second?: number
    },
    breakTime: {
      hour: number,
      minute: number,
      second?: number
    },
    longBreakTime: {
      hour: number,
      minute: number,
      second?: number
    },
  }

  interface ElectronResponse {
    success: boolean,
    data?: Object,
    error?: Error
  }
}

export {};
