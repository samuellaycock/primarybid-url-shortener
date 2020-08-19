import path from "path";
import express from "express";
import { PORT } from "./env";
import log from "./log";

const logger = log("server");
const app = express();

app.use(express.static(path.resolve(__dirname, "../client")));

export default {
    listen(): Promise<void> {
        logger.info("Starting");

        return new Promise((resolve, reject) => {
            app.listen(PORT, (error) => {
                if (error) {
                    reject(error);
                } else {
                    logger.info(`Server listening at http://localhost:${PORT}`);
                    resolve();
                }
            });
        })
    },
    app
}
