import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../config/jwt.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
    [name, email, hashedPassword]
  );

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!result.rows.length)
    return res.status(400).json({ error: "Invalid email or password" });

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = generateToken(user);

  res.json({ token });
};
