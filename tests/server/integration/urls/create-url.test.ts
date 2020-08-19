import request from "supertest";
import casual from "casual";
import server from "../../../../server/src/server";

describe.only("integration::server/src/endpoints/create-url.ts", () => {
    test("it returns the correct response when successful", async () => {
        const { url}  = casual;
        const res = await request(server.app)
            .post("/api/v1/urls")
            .send({ url })
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, data } = res.body;
    
        expect(status).toEqual(201);
        expect(success).toEqual(true);
        expect(data).toHaveProperty("url", url);
    });

    test("it returns the correct error when not given a URL", async () => {
        const res = await request(server.app)
            .post("/api/v1/urls")
            .send({ })
            .expect("Content-Type", /json/)
            .expect(200);
        const { status, success, error } = res.body;
    
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
            .expect(200);
        const { status, success, error } = res.body;
    
        expect(status).toEqual(422);
        expect(success).toEqual(false);
        expect(error).toEqual("'url' must be a valid URL");
    });
});

