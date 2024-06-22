// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { TaskEvent } from './events/projectEvents/projectTaskEvents';
import { ProjectEvent } from './events/projectEvents/projectEvents';
import { TimerEvent } from './events/timerEvents';
import { WindowButtonEvent } from './events/windowButtonEvents';

export type Channels = 'ipc-example' | 
  WindowButtonEvent | 
  TimerEvent |
  ProjectEvent |
  TaskEvent;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
