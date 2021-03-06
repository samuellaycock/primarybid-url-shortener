import request from "supertest";
import server from "../../../../server/src/server";

describe("integration::server/src/endpoints/errors/not-found.ts", () => {
    test("it returns the correct error", async () => {
        const res = await request(server.app)
            .post("/api/v1/invalid_endpoint")
            .expect("Content-Type", /json/)
            .expect(404);

        const { status, success, error } = res.body;

        expect(status).toBe(404);
        expect(success).toBe(false);
        expect(error).toBe("Not found")
    });
});
