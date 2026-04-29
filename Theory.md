# Теория: Express.js и разработка на REST API с Node.js

*Проект по фреймуърк системи* 
Тема: Разработка на Task Manager API с Express.js и SQLite

---

## Съдържание

1. [Преглед на Express.js](#1-преглед-на-expressjs)
2. [Инсталация, използване и маршрутизация](#2-инсталация-използване-и-маршрутизация)
3. [Основни технологии и принципи](#3-основни-технологии-и-принципи)
4. [Предоставени компоненти](#4-предоставени-компоненти)
5. [Предимства и недостатъци](#5-предимства-и-недостатъци)
6. [Реална употреба и примери](#6-реална-употреба-и-примери)
7. [Обяснение на нашия Task Manager код](#7-обяснение-на-нашия-task-manager-код)

---

## 1. Преглед на Express.js

### 1.1 Какво е Express.js?

Express.js е минималистичен и гъвкав уеб приложен фреймуърк за Node.js, предоставящ стабилен набор от функции за изграждане на уеб и мобилни приложения. Той е фактически стандарт в Node.js екосистемата за изграждане на сървърни приложения и REST API-та.

Express е проектиран с философията за минимализъм – предоставя само това, което е необходимо за HTTP сървърна комуникация, без да налага конкретна структура или конвенции. Това го прави изключително гъвкав, но и изисква разработчикът сам да вземе архитектурни решения.

### 1.2 История и развитие

Express.js е създаден от **TJ Holowaychuk** и публикуван за първи път през **2010 година**. Проектът бързо набира популярност благодарение на:

- Простотата на API-то
- Обширната екосистема от middleware пакети
- Активната общност и документация
- Директната интеграция с Node.js HTTP модула

През 2014 г. Express е предаден под управлението на **StrongLoop**, а по-късно – на **IBM**. Понастоящем е под управлението на **OpenJS Foundation**, която осигурява дългосрочната му поддръжка.

Към днешна дата Express се използва в над **5 милиона** проекта в npm registry и е изтеглян над **30 милиона пъти седмично**, което го прави един от най-широко използваните Node.js пакети.

### 1.3 Позиционирането на Express в екосистемата

Express заема средата между "суровия" Node.js HTTP модул и по-опinionated фреймуърки като **NestJS** или **Hapi.js**. Той предлага:

- По-висока абстракция от `http.createServer()`
- По-малко конвенции от NestJS
- По-добра производителност от по-тежки фреймуърки

```
       Суров Node.js HTTP
              ↓
          Express.js         ← нашето ниво
              ↓
       Koa / Fastify
              ↓
    NestJS / AdonisJS
```

[Insert image here: диаграма на Node.js фреймуърк екосистемата]

---

## 2. Инсталация, използване и маршрутизация

### 2.1 Инсталация

За да използвате Express в нов проект, са необходими следните стъпки:

**Предварителни изисквания:**
- Node.js (v18 или по-нова версия)
- npm (идва заедно с Node.js)

**Стъпки за инсталация:**

```bash
# Инициализиране на нов проект
npm init -y

# Инсталиране на Express
npm install express

# За разработка може да добавите nodemon за автоматично рестартиране
npm install --save-dev nodemon
```

**Добавяне на start скрипт в package.json:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.2 Основно използване – Hello World

Минималният Express сървър изглежда така:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Здравей, свят!');
});

app.listen(3000, () => {
  console.log('Сървърът работи на порт 3000');
});
```

[Insert image here: скрийншот на терминал с работещ Express сървър]

При изпълнение на `node server.js` и отваряне на `http://localhost:3000` в браузъра, ще видите текста "Здравей, свят!".

### 2.3 Маршрутизация (Routing)

Маршрутизацията определя как приложението отговаря на клиентска заявка към конкретен endpoint (URL) с конкретен HTTP метод.

**Синтаксис на маршрут:**

```javascript
app.METHOD(PATH, HANDLER)
```

Където:
- `app` е инстанция на Express
- `METHOD` е HTTP метод (get, post, put, delete, patch и др.)
- `PATH` е пътят на сървъра
- `HANDLER` е функцията, изпълнявана при съвпадение

**Примери за основни маршрути:**

```javascript
// GET заявка
app.get('/tasks', (req, res) => {
  res.json({ message: 'Списък с всички задачи' });
});

// POST заявка
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  res.status(201).json({ message: `Задача "${title}" е създадена` });
});

// PUT заявка с параметър
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Задача ${id} е обновена` });
});

// DELETE заявка с параметър
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Задача ${id} е изтрита` });
});
```

### 2.4 Параметри на маршрута

Express поддържа три вида параметри:

**Route параметри** (`:param`) – динамични части от URL пътя:

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  console.log(req.params); // { userId: '123', bookId: '456' }
});
```

**Query параметри** – добавени след `?` в URL-а:

```javascript
// GET /tasks?completed=true&limit=10
app.get('/tasks', (req, res) => {
  console.log(req.query); // { completed: 'true', limit: '10' }
});
```

**Body параметри** – изпратени в тялото на заявката:

```javascript
app.post('/tasks', (req, res) => {
  console.log(req.body); // { title: 'Задача', description: 'Описание' }
});
```

### 2.5 Router модули

За по-добра организация на кода Express предоставя `Router` клас:

```javascript
// routes/tasks.js
const express = require('express');
const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

// server.js
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);
```

[Insert image here: диаграма на структура с Router модули]

---

## 3. Основни технологии и принципи

### 3.1 Node.js и Event Loop

Express е изграден върху **Node.js**, чиято основна характеристика е **асинхронният, неблокиращ I/O модел**, базиран на **Event Loop**.

**Как работи Event Loop:**

```
   ┌─────────────────────────────────┐
   │         Event Loop              │
   │                                 │
   │  1. Timers (setTimeout)         │
   │  2. Pending callbacks           │
   │  3. Idle / prepare              │
   │  4. Poll (I/O events)  ◄────────┼── HTTP заявки, File I/O
   │  5. Check (setImmediate)        │
   │  6. Close callbacks             │
   └─────────────────────────────────┘
```

За разлика от традиционните многонишкови сървъри (Apache, Java Tomcat), Node.js използва **единична нишка** с асинхронни callback функции. Това означава, че сървърът може да обработва хиляди едновременни връзки без да заема памет за всяка нишка.

### 3.2 HTTP протокол и REST архитектура

**HTTP (HyperText Transfer Protocol)** е протоколът за комуникация между клиент и сървър в мрежата. Express абстрахира директната работа с HTTP, предоставяйки по-удобен интерфейс.

**REST (Representational State Transfer)** е архитектурен стил, дефиниран от Roy Fielding в неговата дисертация от 2000 г. Основните принципи на REST са:

| Принцип | Описание |
|---------|----------|
| **Client-Server** | Клиентът и сървърът са разделени |
| **Stateless** | Всяка заявка съдържа цялата необходима информация |
| **Cacheable** | Отговорите могат да се кешират |
| **Uniform Interface** | Стандартизиран интерфейс (HTTP методи, URL ресурси) |
| **Layered System** | Клиентът не знае дали комуникира директно със сървъра |

**HTTP методи в REST контекст:**

| HTTP Метод | CRUD операция | Описание |
|------------|---------------|----------|
| GET        | Read          | Четене на ресурс |
| POST       | Create        | Създаване на нов ресурс |
| PUT        | Update        | Пълно обновяване на ресурс |
| PATCH      | Update        | Частично обновяване |
| DELETE     | Delete        | Изтриване на ресурс |

### 3.3 Middleware концепция

Middleware е ключова концепция в Express. Всяка middleware функция е функция с три аргумента: `(req, res, next)`.

```
HTTP Заявка → [MW1] → [MW2] → [MW3] → Route Handler → HTTP Отговор
```

**Видове middleware:**

1. **Вградено (Built-in):** `express.json()`, `express.urlencoded()`, `express.static()`
2. **Трето лице (Third-party):** `cors`, `morgan`, `helmet`, `passport`
3. **Потребителско (Custom):** написано от разработчика
4. **Обработка на грешки (Error-handling):** функции с четири аргумента `(err, req, res, next)`

```javascript
// Примерна custom middleware за логване
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next(); // Задължително извикване за продължаване
};

app.use(logger);
```

### 3.4 SQLite като база данни

**SQLite** е вградена релационна база данни, която съхранява всички данни в единичен файл на диска. За разлика от MySQL или PostgreSQL, не изисква отделен сървърен процес.

**Предимства на SQLite за малки проекти:**
- Нулева конфигурация
- Преносимост (един .db файл)
- Перфектна за прототипи и малки приложения
- Напълно поддържа SQL стандарта
- ACID-съвместима (Atomicity, Consistency, Isolation, Durability)

**SQLite vs традиционни RDBMS:**

| Характеристика | SQLite | MySQL / PostgreSQL |
|---------------|--------|--------------------|
| Конфигурация | Не е необходима | Необходима |
| Сървър | Не | Да |
| Едновременни записи | Ограничени | Много |
| Размер | До 281 ТБ | Практически неограничен |
| Идеален за | Прототипи, IoT | Production системи |

[Insert image here: сравнителна диаграма SQLite vs MySQL]

### 3.5 Асинхронно програмиране

В Node.js операциите с файлова система и база данни са асинхронни. Express поддържа три модела:

**Callbacks (традиционен):**
```javascript
db.all('SELECT * FROM tasks', [], (err, rows) => {
  if (err) return res.status(500).json({ error: err.message });
  res.json(rows);
});
```

**Promises:**
```javascript
db.all('SELECT * FROM tasks')
  .then(rows => res.json(rows))
  .catch(err => res.status(500).json({ error: err.message }));
```

**Async/Await (модерен):**
```javascript
app.get('/tasks', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 4. Предоставени компоненти

### 4.1 Обект `app`

Централният обект на всяко Express приложение, създаден чрез `express()`:

```javascript
const app = express();
```

**Основни методи:**

| Метод | Описание |
|-------|----------|
| `app.use([path], middleware)` | Регистрира middleware |
| `app.get(path, handler)` | Дефинира GET маршрут |
| `app.post(path, handler)` | Дефинира POST маршрут |
| `app.put(path, handler)` | Дефинира PUT маршрут |
| `app.delete(path, handler)` | Дефинира DELETE маршрут |
| `app.listen(port, callback)` | Стартира HTTP сървъра |
| `app.set(name, value)` | Задава настройки на приложението |

### 4.2 Обект `Request` (req)

Обектът `req` представлява входящата HTTP заявка и съдържа:

```javascript
app.post('/tasks/:id', (req, res) => {
  req.params.id;        // URL параметри: /tasks/123 → '123'
  req.query.filter;     // Query string: ?filter=done → 'done'
  req.body.title;       // JSON тяло на заявката
  req.headers['content-type']; // HTTP хедъри
  req.method;           // 'POST'
  req.url;              // '/tasks/123'
  req.ip;               // IP адрес на клиента
});
```

### 4.3 Обект `Response` (res)

Обектът `res` позволява изпращане на HTTP отговори:

```javascript
// Изпращане на JSON
res.json({ id: 1, title: 'Задача' });

// Задаване на статус код
res.status(201).json({ message: 'Създадено' });
res.status(404).json({ error: 'Не е намерено' });
res.status(500).json({ error: 'Сървърна грешка' });

// Изпращане на обикновен текст
res.send('Здравей!');

// Пренасочване
res.redirect('/tasks');

// Задаване на хедъри
res.set('Content-Type', 'application/json');
res.setHeader('X-Custom-Header', 'стойност');
```

### 4.4 HTTP статус кодове

| Код | Категория | Описание |
|-----|-----------|----------|
| 200 | OK | Успешна заявка |
| 201 | Created | Ресурсът е създаден |
| 204 | No Content | Успешна заявка без тяло |
| 400 | Bad Request | Невалидна заявка от клиента |
| 401 | Unauthorized | Необходима е автентикация |
| 403 | Forbidden | Достъпът е отказан |
| 404 | Not Found | Ресурсът не е намерен |
| 500 | Internal Server Error | Грешка на сървъра |

### 4.5 Вграден Middleware

**`express.json()`** – парсва JSON тела на POST/PUT заявки:

```javascript
app.use(express.json());
// След това req.body ще съдържа парсирания JSON обект
```

**`express.urlencoded()`** – парсва form-encoded данни:

```javascript
app.use(express.urlencoded({ extended: true }));
```

**`express.static()`** – сервира статични файлове:

```javascript
app.use(express.static('public'));
// Файловете в /public директорията стават достъпни
```

### 4.6 Модул `express.Router()`

Router-ът позволява групиране на свързани маршрути в отделни файлове:

```javascript
// routes/tasks.js
const router = express.Router();

router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
```

[Insert image here: диаграма на Router структура за Task Manager]

---

## 5. Предимства и недостатъци

### 5.1 Предимства на Express.js

**1. Минимализъм и гъвкавост**

Express не налага конкретна структура на проекта. Разработчикът има пълна свобода да организира кода по начин, който отговаря на нуждите на проекта. Това е особено ценно при малки API-та или прототипи, където не е необходима сложна архитектура.

**2. Огромна екосистема**

npm съдържа хиляди middleware пакети, съвместими с Express:
- `cors` – управление на Cross-Origin Resource Sharing
- `helmet` – HTTP security хедъри
- `morgan` – HTTP request логиране
- `passport` – автентикация (JWT, OAuth, Local)
- `multer` – качване на файлове
- `express-validator` – валидация на входни данни

**3. Отлична производителност**

Express добавя минимален overhead върху Node.js HTTP модула. При сравнителни тестове (benchmarks), Express обработва десетки хиляди заявки в секунда на стандартен хардуер.

**4. Обширна документация и общност**

Express разполага с официална документация, хиляди tutorials, Stack Overflow въпроси и активна GitHub общност. Намирането на решения на проблеми е лесно.

**5. Лесно обучение**

За разлика от NestJS (Angular-вдъхновен, TypeScript, декоратори), Express може да се научи за часове. Основната концепция – маршрути и middleware – е интуитивна.

**6. Универсалност**

Express подходящ за:
- REST API сървъри
- GraphQL сървъри (с `express-graphql`)
- Server-Side Rendering (SSR)
- Уеб сокет сървъри
- Proxy сървъри

### 5.2 Недостатъци на Express.js

**1. Липса на конвенции**

Гъвкавостта е двуострo оръжие. При по-голям екип или сложен проект, липсата на стандартна структура може да доведе до "спагети код" и трудна поддръжка. Всеки разработчик може да организира кода по различен начин.

**2. Callback hell (при стар код)**

Преди широкото навлизане на async/await, вложените callback функции можеха да станат трудно четими. Съвременният Express код използва Promise или async/await и избягва този проблем.

**3. Ограничена вградена функционалност**

Express не предоставя вградена поддръжка за:
- TypeScript (необходими са допълнителни настройки)
- Валидация на входни данни
- ORM / ODM
- Автентикация
- API документация (Swagger)

Всичко трябва да се добавя чрез трети пакети, което увеличава сложността на управлението на зависимости.

**4. Единична нишка – уязвимост**

Node.js и Express работят на единична нишка. CPU-интензивни операции (криптография, обработка на изображения) блокират Event Loop и забавят всички заявки. Решението е използване на `worker_threads` или отделни микросервизи.

**5. Сигурност по подразбиране**

Express не добавя автоматично security хедъри. Необходимо е ръчно добавяне на `helmet` middleware за защита срещу XSS, Clickjacking и др.

### 5.3 Сравнение с алтернативи

| Характеристика | Express | Fastify | NestJS | Koa |
|---------------|---------|---------|--------|-----|
| Производителност | Добра | Отлична | Добра | Много добра |
| Лесно обучение | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ |
| Структура | Свободна | Свободна | Строга | Свободна |
| TypeScript | Опционален | Вграден | Задължителен | Опционален |
| Екосистема | Огромна | Голяма | Голяма | Средна |
| Идеален за | Всичко | High-perf API | Enterprise | Модерни API |

[Insert image here: benchmark графика за заявки/секунда при различни фреймуърки]

---

## 6. Реална употреба и примери

### 6.1 Кой използва Express.js?

Express е технологията зад десетки известни компании и продукти:

**IBM** – използва Express в своята IBM Watson API платформа за изграждане на AI микросервизи.

**Uber** – ранните версии на Uber backend използват Node.js + Express за обработка на геолокационни данни в реално време.

**Twitter** – части от Twitter frontend рендиращ сървър използват Node.js с Express.

**PayPal** – PayPal мигрира Java бекенда си към Node.js + Express, постигайки 2x намаление на времето за отговор.

**LinkedIn** – мобилното приложение на LinkedIn използва Node.js + Express, намалявайки броя сървъри от 30 на 3.

**Mozilla** – официалната MDN Web Docs платформа използва Express.

### 6.2 Реален пример: REST API за блог система

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Симулирана база данни
let posts = [
  { id: 1, title: 'Първа статия', content: 'Съдържание...', author: 'Иван' }
];

// GET всички статии
app.get('/posts', (req, res) => {
  res.json(posts);
});

// POST нова статия
app.post('/posts', (req, res) => {
  const post = {
    id: posts.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  posts.push(post);
  res.status(201).json(post);
});

// GET статия по ID
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Статията не е намерена' });
  res.json(post);
});

app.listen(3000);
```

### 6.3 Пример: Middleware за автентикация с JWT

```javascript
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'тайна_ключ';

// Middleware за проверка на JWT токен
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Липсва токен за автентикация.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Невалиден или изтекъл токен.' });
  }
};

// Защитен маршрут
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

[Insert image here: Postman скрийншот с Authorization Bearer токен]

### 6.4 Пример: Обработка на грешки

```javascript
// Централизиран error handler – добавя се последен
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Вътрешна сървърна грешка',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler – за всички непознати маршрути
app.use((req, res) => {
  res.status(404).json({ error: `Маршрутът ${req.url} не съществува.` });
});
```

### 6.5 Пример: Свързване с MySQL (Production сценарий)

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'taskmanager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 7. Обяснение на нашия Task Manager код

### 7.1 Архитектура на проекта

Нашият Task Manager е монолитно REST API приложение с единичен сървърен файл (`server.js`). Архитектурата следва класическия MVC (Model-View-Controller) модел в опростен вид:

```
Client (Postman / Frontend)
        ↓ HTTP заявка
    Express Router
        ↓
   Route Handler (Controller логика)
        ↓
   SQLite Database (Model)
        ↓
   JSON Response → Client
```

### 7.2 Детайлен анализ на `server.js`

#### Секция 1: Инициализация и конфигурация

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;
```

Тук зареждаме трите модула:
- **express** – уеб фреймуърк за маршрутизация и middleware
- **sqlite3** – Node.js binding за SQLite база данни, `.verbose()` активира детайлни error съобщения при дебъгване
- **path** – вграден Node.js модул за работа с файлови пътища

`PORT = 3000` е конвенционалният порт за разработка.

#### Секция 2: Middleware конфигурация

```javascript
app.use(express.json());
```

`express.json()` е вграден middleware, добавен в Express 4.16+. Той:
1. Проверява `Content-Type: application/json` хедъра
2. Парсира JSON тялото на заявката
3. Прикача резултата към `req.body`

Без тази линия `req.body` би бил `undefined` при POST и PUT заявки.

#### Секция 3: Свързване с база данни

```javascript
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Грешка при свързване:', err.message);
    process.exit(1);
  }
  console.log('Успешно свързване с SQLite базата данни.');
});
```

`sqlite3.Database()` отваря (или създава) SQLite файл. При грешка (например липса на права за запис) приложението се прекратява с `process.exit(1)` – неуспешен exit код, сигнализиращ на операционната система за проблем.

#### Секция 4: Автоматично създаване на таблица

```javascript
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    completed   INTEGER NOT NULL DEFAULT 0
  )`,
  ...
);
```

Клаузата `IF NOT EXISTS` е ключова – тя гарантира, че таблицата се създава само ако не съществува. При всяко следващо стартиране на сървъра, тази SQL команда се изпълнява, но не засяга съществуващите данни.

**Схема на таблицата:**

| Колона | Тип | Описание |
|--------|-----|----------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Уникален идентификатор, автоматично нараства |
| title | TEXT NOT NULL | Заглавие на задачата (задължително) |
| description | TEXT | Описание (незадължително) |
| completed | INTEGER DEFAULT 0 | 0 = незавършена, 1 = завършена |

SQLite няма булев тип, затова използваме INTEGER (0/1) за `completed`.

[Insert image here: Postman GET /tasks скрийншот с празен масив при първо стартиране]

#### Секция 5: GET /tasks endpoint

```javascript
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Грешка при четене на задачите.' });
    }
    const tasks = rows.map((row) => ({ ...row, completed: !!row.completed }));
    res.json(tasks);
  });
});
```

`db.all()` изпълнява SQL заявка и връща **всички редове** като масив. При `db.get()` би върнал само един ред.

Трансформацията `!!row.completed` преобразува числото (0 или 1) в булева стойност (false или true), тъй като JSON клиентите очакват `boolean`, не `integer`.

[Insert image here: Postman скрийншот на GET /tasks с примерни данни]

#### Секция 6: POST /tasks endpoint

```javascript
app.post('/tasks', (req, res) => {
  const { title, description = '', completed = false } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Полето "title" е задължително.' });
  }
  ...
  db.run(
    'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
    [title.trim(), description, completedInt],
    function (err) {
      res.status(201).json({ id: this.lastID, ... });
    }
  );
});
```

Важни детайли:
- **Деструктуриране с defaults** – `description = ''` и `completed = false` задават стойности при липса в body
- **Валидация** – проверяваме за празно `title` и връщаме 400 Bad Request
- **Параметризирани заявки (`?`)** – критично за сигурността! Предотвратява SQL injection атаки
- **`this.lastID`** – достъпна само в `function()` callback (не в arrow function), съдържа ID-то на последния вмъкнат ред

[Insert image here: Postman скрийншот на POST /tasks с попълнено JSON тяло и успешен отговор 201]

#### Секция 7: PUT /tasks/:id endpoint

```javascript
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (!row) {
      return res.status(404).json({ error: `Задача с id ${id} не е намерена.` });
    }
    // Merge на стари и нови стойности
    const newTitle = title !== undefined ? title.trim() : row.title;
    ...
    db.run('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?', ...);
  });
});
```

Логиката е в два стъпки:
1. **SELECT** – проверка дали задачата съществува (404 ако не)
2. **UPDATE** – обновяване с нови стойности, запазвайки стари там където няма нови

Подходът "merge" позволява частично обновяване дори чрез PUT метод (официално PUT трябва да замени изцяло ресурса, но PATCH е по-правилен за частично обновяване).

[Insert image here: Postman скрийншот на PUT /tasks/1 с обновен JSON и отговор 200]

#### Секция 8: DELETE /tasks/:id endpoint

```javascript
app.delete('/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (this.changes === 0) {
      return res.status(404).json({ error: `Задача с id ${id} не е намерена.` });
    }
    res.json({ message: `Задача с id ${id} е успешно изтрита.` });
  });
});
```

`this.changes` е броят на засегнатите редове след изпълнението на SQL командата. Ако е 0, задачата не е съществувала (404).

[Insert image here: Postman скрийншот на DELETE /tasks/1 с успешен отговор]

### 7.3 Поток на данните при POST заявка

```
Postman изпраща:
POST /tasks
Content-Type: application/json
Body: { "title": "Задача", "description": "Описание", "completed": false }
        ↓
express.json() парсира body → req.body = { title: "Задача", ... }
        ↓
Route handler валидира title
        ↓
db.run() вмъква в SQLite
        ↓
Callback получава this.lastID = 1
        ↓
res.status(201).json({ id: 1, title: "Задача", ... })
        ↓
Postman получава JSON отговор
```

### 7.4 Сигурност и добри практики

Нашият код следва няколко важни принципа за сигурност:

**1. Параметризирани SQL заявки** – всички заявки използват `?` placeholder, предотвратявайки SQL injection:

```javascript
// ПРАВИЛНО (параметризирано)
db.run('SELECT * FROM tasks WHERE id = ?', [id]);

// ГРЕШНО (уязвимо на SQL injection)
db.run(`SELECT * FROM tasks WHERE id = ${id}`);
```

**2. Валидация на входни данни** – проверяваме за задължителни полета и ги почистваме с `.trim()`.

**3. Правилни HTTP статус кодове** – 201 за Create, 404 за Not Found, 400 за Bad Request, 500 за сървърни грешки.

**4. Graceful error handling** – всички database операции имат error callbacks, предотвратявайки необработени изключения.

### 7.5 Потенциални подобрения

За production среда нашият Task Manager може да бъде разширен с:

- **Пагинация** – `GET /tasks?page=1&limit=10`
- **Филтриране** – `GET /tasks?completed=true`
- **Автентикация** – JWT токени за защита на endpoints
- **Валидация** – `express-validator` за по-строга проверка на входните данни
- **Логване** – `morgan` middleware за HTTP request логове
- **Environment variables** – `dotenv` за конфигурация
- **По-мащабируема база данни** – PostgreSQL или MySQL за production
- **API документация** – Swagger/OpenAPI спецификация

---

## Заключение

Express.js е изключително мощен инструмент за изграждане на REST API-та с Node.js. Неговата минималистична философия, огромната екосистема и лесното обучение го правят предпочитан избор за хиляди компании и разработчици по целия свят.

Нашият Task Manager демонстрира основните принципи: CRUD операции, работа с база данни, middleware конфигурация и правилна HTTP семантика. Въпреки простотата си, той следва добри практики за сигурност и структура, които са валидни и в production приложения.

---

## Източници и допълнителна литература

1. Express.js Official Documentation – https://expressjs.com
2. Node.js Official Documentation – https://nodejs.org/docs
3. SQLite Documentation – https://www.sqlite.org/docs.html
4. MDN Web Docs: HTTP – https://developer.mozilla.org/en-US/docs/Web/HTTP
5. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine.
6. npm sqlite3 package – https://www.npmjs.com/package/sqlite3
7. OpenJS Foundation – https://openjsf.org

---

