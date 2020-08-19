import mongoose from "mongoose";
import log from "./log";
import { MONGO_URL } from "./env";

const logger = log("mongodb");

export default {
    async connect(): Promise<void> {
        logger.info("Connecting to MongoDB");

        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        });

        logger.info("Connected to MongoDB");
    }
}