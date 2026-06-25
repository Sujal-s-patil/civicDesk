import bcrypt from "bcrypt";
import { insertQuery, findExist } from "../utils/query.js"
import { createError } from "../utils/createError.js"
import { createToken } from "../utils/jwt.js"

const citizenRegister = async (req, res, next) => {
    try {
        const data = req.body;
        const password = data.password;
        data.password = await bcrypt.hash(password, 10);

        // Check if the user already exists based on the aadharcardno
        const [rows] = await findExist("citizens ", "aadhar_card", data.aadhar_card)

        if (rows.length) {
            throw createError("user already exist", 409)
        }
        const responce = await insertQuery(data, "citizens")
        res.status(201).json({ success: true, message: "user created successfully" });
    } catch (error) {
        next(error);
    }
};

const citizenLogin = async (req, res, next) => {
    try {
        const data = req.body;
        const [rows] = await findExist("citizens ", "aadhar_card", data.aadhar_card)
        if (rows.length === 0) throw createError("user does not exist", 404)

        const password = rows[0].password;
        const match = await bcrypt.compare(data.password, password)
        if (!match) throw createError("aadharcardno or password is wrong", 401)

        delete rows[0].password;
        
        const token = createToken(rows[0]);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite:"none",
            path: "/"
        })

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //     sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        //     secure: config.NODE_ENV === "production",
        //     path: "/"
        // })
        res.status(200).json({ success: true, message: "logged in successfully", data: rows[0] })
    } catch (error) {
        next(error);
    }
};


export {
    citizenLogin, citizenRegister
}

