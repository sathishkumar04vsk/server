import express from "express";
import { client } from "./index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  console.log({ salt, hashPassword });
  return hashPassword;
}

router.post("/signup", async function (request, response) {
  const { username, password } = request.body;
  const hashPassword = await genPassword(password);
  const newUser = {
    username: username,
    password: hashPassword,
  };
  const result = await client
    .db("moneyapp")
    .collection("users")
    .insertOne(newUser);
  response.send(result);
});

router.post("/login", async function (request, response) {
  const { username, password } = request.body;
  const userFromDB = await client
    .db("b30wd")
    .collection("users")
    .findOne({ username: username });
  console.log(userFromDB);
  if (!userFromDB) {
    response.status(401).send({ message: "Invalid credentials" });
  } else {
    const storedPassword = userFromDB.password;
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    console.log("isPasswordMatch", isPasswordMatch);

    if (isPasswordMatch) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      response.send({ message: "successfully login", token: token });
    } else {
      response.status(401).send({ message: "Invalid credentials" });
    }
  }
});

export const usersRouter = router;
