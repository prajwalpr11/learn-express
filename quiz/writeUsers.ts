// quiz/writeUsers.ts
import { Router, Request, Response } from 'express';
import { User } from './types';
import fs from 'fs';
import path from 'path';

const router = Router();
const dataFile = path.resolve(__dirname, '../data/users.json');
let users: User[] = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Add a new user
router.post('/adduser', (req: Request, res: Response) => {
    const newUser = req.body as User;
    users.push(newUser);

    fs.writeFile(dataFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.log('Failed to write');
            return res.status(500).send('Failed to save user');
        } else {
            console.log('User Saved');
            res.send('User added successfully');
        }
    });
});

export default router;
