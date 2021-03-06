import request from "supertest";
import casual from "casual";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import server from "../../../../server/src/server";
import { Url, UrlInterface } from "../../../../server/src/models";

describe("integration::server/src/endpoints/urls/delete-url.ts", () => {
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
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongodb.stop();
    });

    test("it returns the correct response when successful", async () => {
        const { url } = casual;
        const createdUrl = await Url.create({ url }) as UrlInterface;
        const res = await request(server.app)
            .delete(`/api/v1/urls/${createdUrl.code}`)
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data } = res.body;
        const deletedUrl = await Url.findOne({ url })
            .lean() as UrlInterface;

        // Response
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(data).toBe("URL deleted");

        // Database
        expect(deletedUrl).toBe(null);
    });

    test("it returns the correct error the URL does not exist", async () => {
        const res = await request(server.app)
            .delete(`/api/v1/urls/invalid_code`)
            .expect("Content-Type", /json/)
            .expect(404);
        const { status, success, error } = res.body;

        // Response
        expect(status).toBe(404);
        expect(success).toBe(false);
        expect(error).toBe("URL not found");
    });
});