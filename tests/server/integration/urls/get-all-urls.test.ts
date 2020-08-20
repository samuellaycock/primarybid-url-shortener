import request from "supertest";
import casual from "casual";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import server from "../../../../server/src/server";
import { Url } from "../../../../server/src/models";

describe("integration::server/src/endpoints/urls/get-all-urls.ts", () => {
    let mongodb;

    beforeAll(async () => {
        mongodb = new MongoMemoryServer();

        const url = await mongodb.getConnectionString();

        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        await Url.insertMany(
            new Array(10).fill(null).map(() => ({ url: casual.url }))
        );
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongodb.stop();
    });

    test("it returns the correct response when successful", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls")
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data } = res.body;

        // Response
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBe(10);
    });
});
