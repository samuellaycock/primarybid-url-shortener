import request from "supertest";
import casual from "casual";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import server from "../../../../server/src/server";
import { Url, UrlInterface } from "../../../../server/src/models";

describe("integration::server/src/endpoints/urls/create-url.ts", () => {
    let mongodb;

    beforeAll(async () => {
        mongodb = new MongoMemoryServer();

        const url = await mongodb.getConnectionString();
    
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        });
    });
      
    afterAll(async () => {
        await mongoose.disconnect();
        await mongodb.stop();
    });

    test("it returns the correct response when successful", async () => {
        const { url}  = casual;
        const res = await request(server.app)
            .post("/api/v1/urls")
            .send({ url })
            .expect("Content-Type", /json/)
            .expect(201);
        const { status, success, data } = res.body;
        const createdUrl = await Url.findOne({ url })
            .lean() as UrlInterface;
    
        // Response
        expect(status).toEqual(201);
        expect(success).toEqual(true);
        expect(data).toHaveProperty("url", url);
        expect(data).toHaveProperty("code");
        expect(data).toHaveProperty("link");

        // Database
        expect(createdUrl).toHaveProperty("url", url);
        expect(createdUrl).toHaveProperty("code");
        expect(createdUrl.code.length).toEqual(8);
        expect(createdUrl).toHaveProperty("createdAt");
        expect(createdUrl.createdAt).toBeInstanceOf(Date);
        expect(createdUrl).toHaveProperty("updatedAt");
        expect(createdUrl.updatedAt).toBeInstanceOf(Date);
    });

    test("it returns the correct error when not given a URL", async () => {
        const res = await request(server.app)
            .post("/api/v1/urls")
            .send({ })
            .expect("Content-Type", /json/)
            .expect(422);
        const { status, success, error } = res.body;
    
        // Response
        expect(status).toEqual(422);
        expect(success).toEqual(false);
        expect(error).toEqual("'url' is required");
    });

    test("it returns the correct error when given an invalid URL", async () => {
        const url = "invalid_url";
        const res = await request(server.app)
            .post("/api/v1/urls")
            .send({ url })
            .expect("Content-Type", /json/)
            .expect(422);
        const { status, success, error } = res.body;
        const createdUrl = await Url.findOne({ url })
            .lean() as UrlInterface;
    
        // Response
        expect(status).toEqual(422);
        expect(success).toEqual(false);
        expect(error).toEqual("'url' must be a valid URL");

        // Database
        expect(createdUrl).toBe(null);
    });
});
