import { createHelia } from 'helia';
import { json } from '@helia/json';
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 1500;

let heliaInstance;
let jsonStore;

export async function setupIPFS() {
if (!heliaInstance) {
    heliaInstance = await createHelia();
    jsonStore = json(heliaInstance);
    }

  return { heliaInstance, jsonStore };
}

setupIPFS().catch(console.error);