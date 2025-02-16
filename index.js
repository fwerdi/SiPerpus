require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const book = require("./routes/book.routes.js");
const admin = require("./routes/admin.routes.js");
const user = require("./routes/user.routes.js");
const peminjaman = require("./routes/peminjaman.routes.js");
const pengembalian = require("./routes/pengembalian.routes.js");
const auth = require("./routes/auth.routes.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Berhasil terhubung ke database"))
  .catch((err) => console.error("Gagal terhubung ke database:", err));

// Dummy Route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Gunakan routes buku di endpoint /api/books
app.use("/api/books", book);
app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/peminjaman", peminjaman);
app.use("/api/pengembalian", pengembalian);
app.use("/auth", auth);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Berhasil terhubung ke database"))
  .catch((err) => console.error("Gagal terhubung ke database:", err));


// Jalankan Server
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
