import { EventEmitter } from 'events';

// Singleton instance of EventEmitter to share between API routes
class ActivityEmitter extends EventEmitter { }

// Use global to handle Next.js hot reloads in dev
const globalForEmitter = global as unknown as { activityEmitter: ActivityEmitter };

export const activityEmitter =
    globalForEmitter.activityEmitter || new ActivityEmitter();

if (process.env.NODE_ENV !== 'production') globalForEmitter.activityEmitter = activityEmitter;

export default activityEmitter;
