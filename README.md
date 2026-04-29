# Task Manager API

Уеб API за управление на задачи, изградено с **Node.js**, **Express** и **SQLite**.

---

## Описание

Task Manager е лесен REST API сървър, който позволява създаване, четене, обновяване и изтриване (CRUD) на задачи. Данните се съхраняват локално в SQLite файл (`tasks.db`), без нужда от отделен сървър за база данни.

---

## Инсталация и стартиране

### Изисквания
- Node.js v20+
- npm

### Стъпки

```bash
# 1. Клониране на проекта
git clone https://github.com/your-username/task-manager.git
cd task-manager

# 2. Инсталиране на зависимости
npm install

# 3. Стартиране на сървъра
node server.js
```

Сървърът ще стартира на `http://localhost:3000`.  
При първо стартиране автоматично се създава `tasks.db` и таблицата `tasks`.

---

## API Endpoints

| Метод  | Endpoint       | Описание                    |
|--------|----------------|-----------------------------|
| GET    | /tasks         | Връща всички задачи         |
| POST   | /tasks         | Създава нова задача         |
| PUT    | /tasks/:id     | Обновява задача по ID       |
| DELETE | /tasks/:id     | Изтрива задача по ID        |

---

## Тестване с Postman

### POST /tasks – Създаване на нова задача

**URL:** `http://localhost:3000/tasks`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "title": "Купи хляб",
  "description": "От магазина до 18:00 часа",
  "completed": false
}
```

**Успешен отговор (201 Created):**
```json
{
  "id": 1,
  "title": "Купи хляб",
  "description": "От магазина до 18:00 часа",
  "completed": false
}
```

---

### PUT /tasks/:id – Обновяване на задача

**URL:** `http://localhost:3000/tasks/1`  
**Method:** `PUT`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "title": "Купи хляб и мляко",
  "description": "От супермаркета",
  "completed": true
}
```

**Успешен отговор (200 OK):**
```json
{
  "id": 1,
  "title": "Купи хляб и мляко",
  "description": "От супермаркета",
  "completed": true
}
```

---

### GET /tasks – Всички задачи

**URL:** `http://localhost:3000/tasks`  
**Method:** `GET`

**Отговор:**
```json
[
  {
    "id": 1,
    "title": "Купи хляб и мляко",
    "description": "От супермаркета",
    "completed": true
  }
]
```

---

### DELETE /tasks/:id – Изтриване на задача

**URL:** `http://localhost:3000/tasks/1`  
**Method:** `DELETE`

**Отговор:**
```json
{
  "message": "Задача с id 1 е успешно изтрита."
}
```

---

## Структура на проекта

```
task-manager/
├── server.js       # Основен сървър и API логика
├── tasks.db        # SQLite база данни (автоматично създадена)
├── package.json
├── README.md
└── Theory.md       # Академична теория за Express.js
```

---

## Лиценз

ISC
