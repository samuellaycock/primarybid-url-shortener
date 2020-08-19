import debug from "debug";
import { LOG_LEVEL, SERVICE_NAME } from "./env";

interface Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (...args: any[]) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: (...args: any[]) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (...args: any[]) => void
}

let level: number;

switch (LOG_LEVEL) {
case "info":
    level = 1;

    break;
case "debug":
    level = 2;

    break;
default:
    level = 0;

    break;
}

export default (component: string): Logger => {
    let namespace = SERVICE_NAME;

    if (component) {
        namespace += `:${component}`;
    }

    const logger = debug(namespace);

    return {
        info: (...log) => {
            if (level >= 1) {
                logger("\t[info] ", ...log);
            }
        },
        debug: (...log) => {
            if (level >= 2) {
                logger("\t[debug] ", ...log);
            }
        },
        error: (...log) => {
            logger("\t[error] ", ...log);
        },
    };
};