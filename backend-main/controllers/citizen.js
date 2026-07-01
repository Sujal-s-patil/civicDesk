import bcrypt from "bcrypt";
import config from "../config/env.js"
import { insertCitizen, findByAadhar } from "../query/citizenQueries.js"
import { createError } from "../utils/createError.js"
import { createToken } from "../utils/jwt.js"
import setAuthCookie from "../utils/cookie.js";

const citizenRegister = async (req, res, next) => {
    try {
        const { password } = req.validatedData
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

        const token = createToken({ ...result, role: "citizen" });
        setAuthCookie(res, token)

        res.status(200).json({ success: true, message: "logged in successfully", data: result })
    } catch (error) {
        next(error);
    }
};


export {
    citizenLogin, citizenRegister
}

