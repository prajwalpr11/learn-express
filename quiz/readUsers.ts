// quiz/readUsers.ts
import { Router, Request, Response } from 'express';
import { User } from './types';
import fs from 'fs';
import path from 'path';

const router = Router();
const dataFile = path.resolve(__dirname, '../data/users.json');
let users: User[] = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Get all usernames
router.get('/usernames', (req: Request, res: Response) => {
    const usernames = users.map((user) => ({
        id: user.id,
        username: user.username,
    }));
    res.send(usernames);
});

// Get a user's email by username
router.get('/username/:name', (req: Request, res: Response) => {
    const username = req.params.name;
    const user = users.find((u) => u.username === username);

    if (user) {
        res.json({ email: user.email });
    } else {
        res.status(404).json({
            error: { message: `User with username "${username}" not found`, status: 404 },
        });
    }
});

export default router;
