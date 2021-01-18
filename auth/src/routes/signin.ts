import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@brndtickets/common";

import { User } from "../models/user";
import { PasswordManager } from "../services/password";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must be enter a valid password"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await PasswordManager.compare(
            existingUser.password,
            password
        );

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // GEnerate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY! // the "!" is just to get rid of TS warnings. We have 100% that JWT_KEY will be verified
        );

        // Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
