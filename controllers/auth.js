import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

export const signup = ([
    body('name', "Please enter your name").isLength({min: 2}),
    body('email', "Please enter your email").isEmail(),
    body('password', "Please enter your password").isLength({min: 5}),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ name: req.body.name });
    if (user) {
        return res.status(404).json({ "error": "Sorry, a user exist with this email already" })
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc; 

        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 31536000,
        }).status(200).json(others);

    } catch (err) {
        res.status(500).send("Internal server error");
    }
});

export const signin = ([
    body('name', "Please enter your name").isLength({min: 2}),
    body('password', "Please enter your password").isLength({min: 5}),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) {
            return res.status(404).json({ error: "Please Login with the correct credentials" })
        }

        const isCorrect = bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) {
            return res.status(404).json({ error: "Please Login with the correct credentials" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc; 

        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 31536000,
        }).status(200).json(others);
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});

export const signout = async (req, res, next) => {
    try {       
        res.clearCookie("access_token").status(200).json("Logged out successfully!");
    } catch (err) {
        next(err);
    }
}
 
export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });

            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);

            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(savedUser._doc);
        }
    } catch (err) {
        next(err);
    }
};