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
        const createdUrl = await Url.create({ url }) as UrlInterface;
        const res = await request(server.app)
            .delete(`/api/v1/urls/${createdUrl.code}`)
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data } = res.body;
        const deletedUrl = await Url.findOne({ url })
            .lean() as UrlInterface;

        // Response
        expect(status).toEqual(200);
        expect(success).toEqual(true);
        expect(data).toEqual("URL deleted");

        // Database
        expect(deletedUrl).toEqual(null);
    });

    test("it returns the correct error the URL does not exist", async () => {
        const res = await request(server.app)
            .delete(`/api/v1/urls/invalid_code`)
            .expect("Content-Type", /json/)
            .expect(404);
        const { status, success, data } = res.body;

        // Response
        expect(status).toEqual(404);
        expect(success).toEqual(false);
        expect(data).toEqual("URL not found");
    });
});