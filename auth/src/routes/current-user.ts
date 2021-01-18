import express from "express";

import { currentUser } from "@brndtickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
    // // if (!req.session || !req.session.jwt) { is equivalent to the following:
    // if (!req.session?.jwt) {
    //     return res.send({ currentUser: null });
    // }

    // try {
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!); // we are sure that process.env.JWT_KEY is defined so we put '!'
    //     res.send({ currentUser: payload });
    // } catch (err) {
    //     res.send({ currentUser: null });
    // }
    res.send({ currentUser: req.currentUser || null }); // will be the actual JSON payload
});

export { router as currentUserRouter };
