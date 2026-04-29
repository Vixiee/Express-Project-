// Зареждане на необходимите модули
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Път до базата данни
const DB_PATH = path.join(__dirname, 'tasks.db');

// Middleware за парсване на JSON тела
app.use(express.json());

// Инициализация на SQLite базата данни
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Грешка при свързване с базата данни:', err.message);
    process.exit(1);
  }
  console.log('Успешно свързване с SQLite базата данни.');
});

// Автоматично създаване на таблица tasks при стартиране
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    completed   INTEGER NOT NULL DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error('Грешка при създаване на таблицата:', err.message);
    } else {
      console.log('Таблица "tasks" е готова.');
    }
  }
);

// ──────────────────────────────────────────────
// GET /tasks – връща всички задачи
// ──────────────────────────────────────────────
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Грешка при четене на задачите.' });
    }
    // Преобразуване на completed от 0/1 към булев тип
    const tasks = rows.map((row) => ({ ...row, completed: !!row.completed }));
    res.json(tasks);
  });
});

// ──────────────────────────────────────────────
// POST /tasks – създава нова задача
// ──────────────────────────────────────────────
app.post('/tasks', (req, res) => {
  const { title, description = '', completed = false } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Полето "title" е задължително.' });
  }

  const completedInt = completed ? 1 : 0;

  db.run(
    'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
    [title.trim(), description, completedInt],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Грешка при създаване на задача.' });
      }
      res.status(201).json({
        id: this.lastID,
        title: title.trim(),
        description,
        completed: !!completed,
      });
    }
  );
});

// ──────────────────────────────────────────────
// PUT /tasks/:id – обновява съществуваща задача
// ──────────────────────────────────────────────
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Първо вземаме текущата задача
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Грешка при намиране на задача.' });
    }
    if (!row) {
      return res.status(404).json({ error: `Задача с id ${id} не е намерена.` });
    }

    // Използваме стари стойности при липса на нови
    const newTitle       = title       !== undefined ? title.trim()    : row.title;
    const newDescription = description !== undefined ? description     : row.description;
    const newCompleted   = completed   !== undefined ? (completed ? 1 : 0) : row.completed;

    if (!newTitle) {
      return res.status(400).json({ error: 'Полето "title" не може да бъде празно.' });
    }

    db.run(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [newTitle, newDescription, newCompleted, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Грешка при обновяване на задача.' });
        }
        res.json({
          id: Number(id),
          title: newTitle,
          description: newDescription,
          completed: !!newCompleted,
        });
      }
    );
  });
});

// ──────────────────────────────────────────────
// DELETE /tasks/:id – изтрива задача по id
// ──────────────────────────────────────────────
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Грешка при изтриване на задача.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: `Задача с id ${id} не е намерена.` });
    }
    res.json({ message: `Задача с id ${id} е успешно изтрита.` });
  });
});

// Стартиране на сървъра
app.listen(PORT, () => {
  console.log(`Task Manager API работи на http://localhost:${PORT}`);
});
