import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { notFound, internalServerError, createUrl } from "./endpoints";
import { PORT } from "./env";
import log from "./log";

const logger = log("server");
const app = express();

app.use(express.static(path.resolve(__dirname, "../client")));
app.use(bodyParser.json());

app.post("/api/v1/urls", createUrl);

app.all("/api*", notFound);

app.use(internalServerError);

export default {
    /* istanbul ignore next */
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
};
