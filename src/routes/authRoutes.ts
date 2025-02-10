import { Router } from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const router = Router();
const userRepository = AppDataSource.getRepository(Users);

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
  }
  else{
    const newUser = userRepository.create({ email, password });
    await userRepository.save(newUser);

    res.status(201).json({ message: "User created successfully" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findOneBy({ email });
  if (!user) {
    res.status(400).json({ message: "Invalid credentials" });
  }

  else{
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        res.status(400).json({ message: "Invalid credentials" });
    }
    else{
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
    }
}
});

export default router;
