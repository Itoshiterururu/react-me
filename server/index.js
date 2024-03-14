import express from "express";
import cors from "cors";
import mysql from "mysql";
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'ваш_хост',
  user: 'ваш_пользователь',
  password: 'ваш_пароль',
  database: 'ваша_база_данных'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных успешно!');
});

app.listen(8080, () => {
  console.log("Server started at 8080 port");
});

app.get('/', (req, res) => {
  res.json({ msg: 'hello from server' });
});

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ msg: 'Ошибка при выполнении запроса' });
      return;
    }
    res.json({ users: results });
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM users WHERE id = ?', id, (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ msg: 'Ошибка при выполнении запроса' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ msg: 'Пользователь не найден' });
      return;
    }
    res.json({ user: results[0] });
  });
});

app.post('/api/users', (req, res) => {
  const user = { ...req.body, id: uuidv4() };
  connection.query('INSERT INTO users SET ?', user, (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ msg: 'Ошибка при выполнении запроса' });
      return;
    }
    res.json({ user });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM users WHERE id = ?', id, (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ msg: 'Ошибка при выполнении запроса' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ msg: 'Пользователь не найден' });
      return;
    }
    res.json({ msg: 'OK, удалено ' + id });
  });
});

app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  connection.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id], (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ msg: 'Ошибка при выполнении запроса' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ msg: 'Пользователь не найден' });
      return;
    }
    res.json({ user: updatedUser });
  });
});
