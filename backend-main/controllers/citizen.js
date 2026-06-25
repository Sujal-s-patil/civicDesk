import bcrypt from "bcrypt";
import { insertCitizen, findByAadhar } from "../query/citizenQueries.js"
import { createError } from "../utils/createError.js"
import { createToken } from "../utils/jwt.js"

const citizenRegister = async (req, res, next) => {
    try {
        const { aadhar_card, password } = req.validatedData
        // Check if the user already exists based on the aadharcardno
        const result = await findByAadhar(aadhar_card)
        if (result) {
            throw createError("user already exist", 409)
        }

        req.validatedData.password = await bcrypt.hash(password, 10)
        const responce = await insertCitizen(req.validatedData)
        res.status(201).json({ success: true, message: "user created successfully" });
    } catch (error) {
        next(error);
    }
};

const citizenLogin = async (req, res, next) => {
    try {
        const { aadhar_card, password } = req.validatedData;
        const result = await findByAadhar(aadhar_card)
        if (!result) throw createError("user does not exist", 404)

        const match = await bcrypt.compare(password, result.password)
        if (!match) throw createError("aadharcardno or password is wrong", 401)

        delete result.password;

        const token = createToken(result);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            path: "/"
        })

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //     sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        //     secure: config.NODE_ENV === "production",
        //     path: "/"
        // })
        res.status(200).json({ success: true, message: "logged in successfully", data: result })
    } catch (error) {
        next(error);
    }
};


export {
    citizenLogin, citizenRegister
}

