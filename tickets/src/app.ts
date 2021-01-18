import express, { NextFunction } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@brndtickets/common";
import {createTicketRouter} from './routes/new';
import {showTicketRouter} from './routes/show';
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

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
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// all() is going to watch for requests with any kind of method and with that any kind of routes (*)
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
