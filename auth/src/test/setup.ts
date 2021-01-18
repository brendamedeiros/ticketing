import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
    namespace NodeJS {
        interface Global {
            getAuthCookie(): Promise<string[]>;
        }
    }
}

let mongo: any;

/** Hook function that is going to run before all the tests starts to be executed */
beforeAll(async () => {
    process.env.JWT_KEY = "xpto";

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

/** Hook function that is going to run before each of the tests  */
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    /** Reset all of the data between each test */
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

/** Hook function after all tests are complete. Stop memory server */
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getAuthCookie = async () => {
    const email = "test@test.com";
    const password = "test1234";

    const response = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
};
