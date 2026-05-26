import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ILoginPayload, IUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hashSync(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor'))
    RETURNING *`,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const loginUserToDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  //1 checking if the user exists
  const userExists = await pool.query(
    `
    SELECT * FROM users WHERE email=$1`,
    [email],
  );
  if (userExists.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const userResult = userExists.rows[0];
  // 2 Matching password
  const matchPassword = await bcrypt.compare(password, userResult.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }
  // 3 Generate token
  const jwtPayload = {
    id: userResult.id,
    name: userResult.name,
    role: userResult.role,
  };
  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });
  const { password: _, ...user } = userResult;

  return { token, user };
};

export const authService = { createUserIntoDB, loginUserToDB };
