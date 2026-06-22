import express from "express";
const citizenRouter = express.Router();

import { citizenLogin, citizenRegister } from "../controllers/citizen.js"

citizenRouter.post("/register", citizenRegister);
citizenRouter.post("/login", citizenLogin);

export default citizenRouter


/* 
{
  "fullName":"sujal patil",
  "aadharcardno":123456789,
  "email":"sujalpatil.com",
  "phoneno":6158496325,
  "address":"shetan galli",
  "city":"bhiwandi",
  "state":"maharashtra",
  "password":"123456789"
}
*/