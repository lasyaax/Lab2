const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

// Function to initialize database table and seed initial rows if empty
const seedDatabaseIfNeeded = async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL,
      pages INTEGER NOT NULL
    );
  `);

  const countResult = await db.get(`SELECT COUNT(*) AS count FROM book;`);
  if (countResult.count === 0) {
    const seedBooks = [
      ["To Kill a Mockingbird", "Harper Lee", 350, 281],
      ["1984", "George Orwell", 299, 328],
      ["The Great Gatsby", "F. Scott Fitzgerald", 250, 180],
      ["Pride and Prejudice", "Jane Austen", 199, 279],
      ["The Catcher in the Rye", "J.D. Salinger", 320, 234],
      ["The Hobbit", "J.R.R. Tolkien", 450, 310],
      ["Fahrenheit 451", "Ray Bradbury", 280, 256],
      ["Brave New World", "Aldous Huxley", 310, 268],
      ["Crime and Punishment", "Fyodor Dostoevsky", 420, 671],
      ["The Alchemist", "Paulo Coelho", 220, 208],
    ];

    for (const book of seedBooks) {
      await db.run(
        `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);`,
        book
      );
    }
    console.log("Database initialized with 10 sample books.");
  }
};

// Async function to open the database and start the server only after connection succeeds
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await seedDatabaseIfNeeded();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// ---------------------------
// CRUD Routes
// ---------------------------

// 1. GET /books/ - Get all books
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id;
    `;
    const booksArray = await db.all(getBooksQuery);
    response.status(200).json(booksArray);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 2. GET /books/:bookId/ - Get a single book by ID
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);
    if (!book) {
      return response.status(404).json({ error: "Book not found" });
    }
    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 3. POST /books/ - Add a new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
    response.status(201).json({
      message: "Book Added Successfully",
      bookId: dbResponse.lastID,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 4. PUT /books/:bookId/ - Update an existing book
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    // Check if book exists
    const checkBookQuery = `SELECT id FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);
    if (!existingBook) {
      return response.status(404).json({ error: "Book not found" });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [title, author, price, pages, bookId]);
    response.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 5. DELETE /books/:bookId/ - Remove a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if book exists
    const checkBookQuery = `SELECT id FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);
    if (!existingBook) {
      return response.status(404).json({ error: "Book not found" });
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);
    response.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = app;

