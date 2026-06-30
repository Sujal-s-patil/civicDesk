import jwt from "jsonwebtoken"
import config from "../config/env.js"

export function createToken(payload) {
    return jwt.sign(payload, config.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "24h"
    })
}

export function verifyJwtToken(token) {
    return jwt.verify(token, config.SECRET_KEY, {
        algorithm: "HS256",
    })
}