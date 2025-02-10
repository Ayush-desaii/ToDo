import { Router } from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Todo } from "../entities/todo";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = Router();
const todoRepository = AppDataSource.getRepository(Todo);

// Get all todos
router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    
    const page = parseInt(req.query.page as string) || 1; // Default page = 1
    const limit = parseInt(req.query.limit as string) || 10; // Default limit = 10

    const todos = await todoRepository.find({ where: { user: { id: req.user!.id } }, take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: "DESC" }, });

    res.json(todos);
  });

// Create a todo
router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
  
    const todo = new Todo();
    todo.title = title;
    todo.user = req.user!;
  
    await todoRepository.save(todo);
    res.status(201).json(todo);
  });

// Update a todo
router.put("/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;
  
    const todo = await todoRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user!.id } }, // ✅ Ensures user owns this todo
    });
  
    if (!todo) {
        res.status(404).json({ message: "Todo not found or unauthorized" });
    }
    else{
        if (title !== undefined) {
        todo.title = title;
        }
    
        if (completed !== undefined) {
        todo.completed = completed;
        }
    
        await todoRepository.save(todo);
        res.json(todo);}
  });

// Delete a todo   
router.delete("/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
  
    const todo = await todoRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user!.id } },
    });
  
    if (!todo) {
      res.status(404).json({ message: "Todo not found or unauthorized" });
    } else {
        await todoRepository.remove(todo);
        res.json({ message: "Todo deleted successfully" });
    }
  

  });
export default router;