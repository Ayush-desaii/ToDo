import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";

export interface AuthRequest extends Request {
  user?: Users;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token);
    
    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return; // ✅ Explicitly return to stop execution
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, email: string };
    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return; // ✅ Explicitly return to stop execution
    }

    req.user = user; // ✅ Attach user to request
    next(); // ✅ Move to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return; // ✅ Explicitly return to stop execution
  }
};
