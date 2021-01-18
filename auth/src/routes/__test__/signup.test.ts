import request from "supertest"; //allow us to fake a request to Express app
import { app } from "../../app";

/** On Jest you can either return or await a given request */

/** send an post request to the route and make sure that we get a status of 201 */
it("returns a 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com", password: "password" })
        .expect(201);
});

it("returns a 400 with an invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({ email: "test", password: "password" })
        .expect(400);
});

it("returns a 400 with an invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com", password: "1" })
        .expect(400);
});

it("returns a 400 with missing email and password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com" })
        .expect(400);

    await request(app)
        .post("/api/users/signup")
        .send({ password: "passwo" })
        .expect(400);
});

it("disallows duplicate emails", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com", password: "password" })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com", password: "password" })
        .expect(400);
});

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({ email: "test@test.com", password: "password" })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});
