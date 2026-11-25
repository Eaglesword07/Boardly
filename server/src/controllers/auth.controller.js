import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as users from "../db/users.js";

function signToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function register(req, res) {
    const { email, name, password  } = req.body ?? {};

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: "A valid email is required" });
    }
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "A name is required" });
    }
    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one symbol" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    try {
        const user = await users.createUser(
            email.trim().toLowerCase(),
            name.trim(),
            passwordHash
        );
        res.status(201).json({ user, token: signToken(user) });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ error: "That email is already registered"});
        }
        throw err;
    }
}

export async function login(req, res) {
    const { email, password } = req.body ?? {};
    
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return res.status(400).json({ error: "Email and Password are required"})
    }

    const user = await users.getUserByEmail(email.trim().toLowerCase());
    const passwordOk = user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordOk) {
        return res.status(401).json({ error: "Invalid email or password"});
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, token: signToken(user) });
}