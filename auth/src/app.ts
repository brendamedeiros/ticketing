import express, { NextFunction } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@brndtickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();

/* Trafiic is being proxied to the app through ingress enginex and by default, Express will say 'there's a proxy here i don't trust this HTTPS connection
    The 'trust proxy' is to make sure that Express is aware that it's behind the proxy of ingress and to make sure that it should still trust traffic as being
    secure even though is coming from that proxy
*/
app.set("trust proxy", true);
app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// all() is going to watch for requests with any kind of method and with that any kind of routes (*)
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
