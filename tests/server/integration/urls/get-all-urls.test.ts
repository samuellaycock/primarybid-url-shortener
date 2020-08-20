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
            new Array(50).fill(null).map(() => ({ url: casual.url }))
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
        const { status, success, data, metadata } = res.body;

        // Response
        expect(status).toEqual(200);
        expect(success).toEqual(true);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toEqual(25);
        expect(metadata).toHaveProperty("page", 1);
        expect(metadata).toHaveProperty("prevPage", null);
        expect(metadata).toHaveProperty("nextPage", 2);
        expect(metadata).toHaveProperty("items", 25);
        expect(metadata).toHaveProperty("totalItems", 50);
    });

    test("it returns the correct response when selecting a page", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?page=2")
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data, metadata } = res.body;

        // Response
        expect(status).toEqual(200);
        expect(success).toEqual(true);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toEqual(25);
        expect(metadata).toHaveProperty("page", 2);
        expect(metadata).toHaveProperty("prevPage", 1);
        expect(metadata).toHaveProperty("nextPage", null);
        expect(metadata).toHaveProperty("items", 25);
        expect(metadata).toHaveProperty("totalItems", 50);
    });

    test("it returns the correct response when selecting a limit", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?limit=5")
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data, metadata } = res.body;

        // Response
        expect(status).toEqual(200);
        expect(success).toEqual(true);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toEqual(5);
        expect(metadata).toHaveProperty("page", 1);
        expect(metadata).toHaveProperty("items", 5);
        expect(metadata).toHaveProperty("prevPage", null);
        expect(metadata).toHaveProperty("nextPage", 2);
        expect(metadata).toHaveProperty("totalItems", 50);
    });

    test("it returns the correct error when selecting an invalid page", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?page=invalid_page")
            .expect("Content-Type", /json/)
            .expect(400);
        const { status, success, error } = res.body;

        // Response
        expect(status).toEqual(400);
        expect(success).toEqual(false);
        expect(error).toEqual("'page' must be a valid positive number");
    });

    test("it returns the correct error when selecting a negative page", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?page=-1")
            .expect("Content-Type", /json/)
            .expect(400);
        const { status, success, error } = res.body;

        // Response
        expect(status).toEqual(400);
        expect(success).toEqual(false);
        expect(error).toEqual("'page' must be a valid positive number");
    });

    test("it returns the correct error when selecting an invalid limit", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?limit=invalid_limit")
            .expect("Content-Type", /json/)
            .expect(400);
        const { status, success, error } = res.body;

        // Response
        expect(status).toEqual(400);
        expect(success).toEqual(false);
        expect(error).toEqual("'limit' must be a valid positive number");
    });

    test("it returns the correct error when selecting a negative limit", async () => {
        const res = await request(server.app)
            .get("/api/v1/urls?limit=-1")
            .expect("Content-Type", /json/)
            .expect(400);
        const { status, success, error } = res.body;

        // Response
        expect(status).toEqual(400);
        expect(success).toEqual(false);
        expect(error).toEqual("'limit' must be a valid positive number");
    });
});
