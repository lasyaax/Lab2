-- Table creation
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

-- Seed data: 10 sample books
INSERT INTO book (title, author, price, pages) VALUES
('To Kill a Mockingbird', 'Harper Lee', 350, 281),
('1984', 'George Orwell', 299, 328),
('The Great Gatsby', 'F. Scott Fitzgerald', 250, 180),
('Pride and Prejudice', 'Jane Austen', 199, 279),
('The Catcher in the Rye', 'J.D. Salinger', 320, 234),
('The Hobbit', 'J.R.R. Tolkien', 450, 310),
('Fahrenheit 451', 'Ray Bradbury', 280, 256),
('Brave New World', 'Aldous Huxley', 310, 268),
('Crime and Punishment', 'Fyodor Dostoevsky', 420, 671),
('The Alchemist', 'Paulo Coelho', 220, 208);

