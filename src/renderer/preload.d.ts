import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }

  interface TimeState {
    hour: number,
    minute: number,
    second?: number
  }

  interface TimerState {
    pomCount: number,
    pomTime: TimeState,
    breakTime: TimeState,
    longBreakTime: TimeState,
  }

  interface ElectronResponse {
    success: boolean,
    data?: any,
    error?: Error
  }
}

export {};
