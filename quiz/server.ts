import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface UserRequest extends Request {
  users?: User[];
}

const app: Express = express();
const port: number = 8000;

const dataFile = path.resolve(__dirname, '../data/users.json');

let users: User[];

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data.toString());
});

const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req: UserRequest, res: Response) => {
  let newuser = req.body as User;
  users.push(newuser);
  fs.writeFile(path.resolve(__dirname, dataFile), JSON.stringify(users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
});

app.use('/write/adduser', addMsgToRequest);
app.post('/write/adduser', (req: UserRequest, res: Response) => {
  const newUser = req.body as User;
  users.push(newUser);

  fs.writeFile(dataFile, JSON.stringify(users), (err) => {
    if (err) {
      console.log('Failed to write');
      res.status(500).send('Failed to save user');
    } else {
      console.log('User Saved');
      res.send('User added successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});