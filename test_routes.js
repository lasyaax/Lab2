const test = async () => {
  const BASE_URL = "http://localhost:3000/books/";

  console.log("=== 1. Testing GET /books/ ===");
  let res = await fetch(BASE_URL);
  let books = await res.json();
  console.log(`Status: ${res.status}, Total books: ${books.length}`);
  console.log("Sample book:", books[0]);

  console.log("\n=== 2. Testing GET /books/1/ ===");
  res = await fetch(`${BASE_URL}1/`);
  let book1 = await res.json();
  console.log(`Status: ${res.status}`);
  console.log("Book 1:", book1);

  console.log("\n=== 3. Testing POST /books/ ===");
  res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Clean Code",
      author: "Robert C. Martin",
      price: 650,
      pages: 464,
    }),
  });
  let postResult = await res.json();
  console.log(`Status: ${res.status}`);
  console.log("POST Result:", postResult);
  const newBookId = postResult.bookId;

  console.log(`\n=== 4. Testing PUT /books/${newBookId}/ ===`);
  res = await fetch(`${BASE_URL}${newBookId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      price: 700,
      pages: 464,
    }),
  });
  let putResult = await res.json();
  console.log(`Status: ${res.status}`);
  console.log("PUT Result:", putResult);

  console.log(`\n=== Verifying updated book GET /books/${newBookId}/ ===`);
  res = await fetch(`${BASE_URL}${newBookId}/`);
  let updatedBook = await res.json();
  console.log("Updated book:", updatedBook);

  console.log(`\n=== 5. Testing DELETE /books/${newBookId}/ ===`);
  res = await fetch(`${BASE_URL}${newBookId}/`, {
    method: "DELETE",
  });
  let delResult = await res.json();
  console.log(`Status: ${res.status}`);
  console.log("DELETE Result:", delResult);

  console.log(`\n=== Verifying deletion GET /books/${newBookId}/ ===`);
  res = await fetch(`${BASE_URL}${newBookId}/`);
  let afterDel = await res.json();
  console.log(`Status: ${res.status}`, afterDel);
};

test().catch(console.error);

