# Lab 2: SQLite database and CRUD routes

**Name:** [Your Name Here] · **Registration Number:** [Your Reg. No.] · **Section:** [Your Section]

**GitHub Repository:** https://github.com/lasyaax/Lab2

**Live Link:** [Deployed URL on Render / Railway, or `Not deployed (local SQLite database - see Postman screenshots below)`]

---

## How to Run

### 1. Prerequisites
- **Node.js** (v18+ or later)
- **npm** (comes with Node.js)
- **SQLite CLI** (optional, for viewing the database file directly via terminal)
- **Postman** (for testing HTTP CRUD routes)

### 2. Installation
Clone your repository:
```bash
git clone https://github.com/lasyaax/Lab2.git
cd Lab2
npm install
```

### 3. Environment Variables
No mandatory secret environment variables are required. You can optionally specify a custom port in a `.env` file (which is never committed):
```env
PORT=3000
```

### 4. Database Setup
The server automatically creates `books.db` and populates 10 sample books if the table is empty upon startup. Alternatively, you can seed it manually via SQLite CLI:
```bash
sqlite3 books.db < init_db.sql
```

### 5. Start the Server
- **Development mode (using Nodemon for auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```
The server will start at `http://localhost:3000/`.

---

## Endpoints

| Method | Endpoint | Description | Status Code | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/books/` | Retrieve all books from the database | `200 OK` | None |
| **GET** | `/books/:bookId/` | Retrieve a single book by its ID | `200 OK` / `404 Not Found` | URL param `bookId` |
| **POST** | `/books/` | Add a new book to the database | `201 Created` / `400 Bad Request` | JSON: `{ "title", "author", "price", "pages" }` |
| **PUT** | `/books/:bookId/` | Update all details of an existing book | `200 OK` / `404 Not Found` | URL param `bookId`, JSON body with updated fields |
| **DELETE** | `/books/:bookId/` | Remove a book by its ID from the database | `200 OK` / `404 Not Found` | URL param `bookId` |

---

## Screenshots

> Add your Postman screenshots in the `screenshots/` directory and link them here:

### 1. GET `/books/` - Get all books
![GET All Books](screenshots/01-get-all-books.png)

### 2. GET `/books/:bookId/` - Get single book
![GET Single Book](screenshots/02-get-single-book.png)

### 3. POST `/books/` - Add a new book
![POST Add Book](screenshots/03-post-add-book.png)

### 4. PUT `/books/:bookId/` - Update a book
![PUT Update Book](screenshots/04-put-update-book.png)

### 5. DELETE `/books/:bookId/` - Delete a book
![DELETE Book](screenshots/05-delete-book.png)

### 6. SQLite CLI verification
![SQLite CLI Verification](screenshots/06-sqlite-cli-verify.png)

---

## Notes: Problems Faced and How You Solved Them

1. **Database-Server Synchronization**:
   - *Problem:* Starting the Express HTTP listener before the SQLite connection opened led to unhandled promise rejections on initial requests.
   - *Solution:* Encapsulated the database connection and `app.listen()` inside a single `async function initializeDBAndServer()`, ensuring the server only listens after `db = await open(...)` succeeds.

2. **SQL Injection Vulnerabilities**:
   - *Problem:* Concatenating user inputs directly into raw SQL strings is dangerous and allows malicious input injection.
   - *Solution:* Used parameterized queries with `?` placeholders for all dynamic inputs (`db.get(query, [bookId])`, `db.run(query, [title, author, price, pages])`).

3. **Status Codes for Missing Resources**:
   - *Problem:* Querying or updating a non-existent `bookId` should not return a generic 200 or 500 error.
   - *Solution:* Added checks using `db.get(...)` to verify whether the record exists, returning HTTP `404 Not Found` with a descriptive JSON error message.

---

## Viva Questions & Answers

### Q1: Why await the database call?
> **Answer:** Database operations (such as disk I/O, query execution, indexing) are asynchronous and take time to complete. In Node.js, asynchronous operations return Promises. Using `await` pauses the execution of the async function until the Promise resolves or rejects, ensuring data is available before sending the HTTP response. Without `await`, the code would send back an unresolved Promise or `undefined` to the client.

### Q2: What is SQL injection and how do placeholders prevent it?
> **Answer:** SQL Injection is a web security vulnerability where an attacker manipulates SQL queries by inputting malicious SQL syntax into user input fields (e.g., `' OR '1'='1`). 
> Parameterized queries with `?` placeholders prevent this because the SQLite driver treats the parameter strictly as literal data (a typed value), rather than executable SQL command text, neutralizing any malicious command injection.

### Q3: When is PUT used instead of POST?
> **Answer:** 
> - **POST** is used to create a new resource. It is typically **not idempotent** (calling `POST /books/` multiple times creates multiple distinct records with different IDs).
> - **PUT** is used to update or replace an existing resource completely at a specific URI (`PUT /books/:bookId/`). It is **idempotent** (calling `PUT` multiple times with the exact same data produces the identical state on the server without creating extra duplicate records).

