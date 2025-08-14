import { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

let socketInstance: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(URL, {
      withCredentials: true,
    });
  }

  return socketInstance;
};
