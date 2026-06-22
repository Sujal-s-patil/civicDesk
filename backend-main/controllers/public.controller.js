
import bcrypt from "bcrypt";
import { insertQuery, findExist } from "../utils/query.js"
import { createError } from "../utils/createError.js"
import { createToken } from "../utils/jwt.js"

const publicRegister = async (req, res, next) => {
    try {
        const data = req.body;
        const password = data.password;
        data.password = await bcrypt.hash(password, 10);

        // Check if the user already exists based on the aadharcardno
        const [results] = await findExist("public", "aadharcardno", data.aadharcardno)

        if (results.length) {
            throw createError("user already exist", 409)
        }
        const responce = await insertQuery(data, "public")
        res.status(201).json({ success: true, message: "user created successfully" });
    } catch (error) {
        next(error);
    }
};

const publicLogin = async (req, res, next) => {
    try {
        const data = req.body;
        const [results] = await findExist("public", "aadharcardno", data.aadharcardno)
        if (results.length === 0) throw createError("user does not exist", 404)

        const password = results[0].password;
        const status = await bcrypt.compare(data.password, password)
        if (status) {
            const token = createToken(results);
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                path: "/"
            })

            // res.cookie("token", token, {
            //     httpOnly: true,
            //     maxAge: 24 * 60 * 60 * 1000,
            //     sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            //     secure: config.NODE_ENV === "production",
            //     path: "/"
            // })
            res.status(200).json({ success: true, message: "logged in successfully", results })
        } else {
            throw createError("aadharcardno or password is wrong", 401)
        }
    } catch (error) {
        next(error);
    }
};


export {
    publicRegister,
    publicLogin
}

