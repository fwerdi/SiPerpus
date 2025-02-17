const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

// 📌 Register User (Guru / Murid)
exports.registerUser = async (req, res) => {
  try {
    const { role, NIP, NISN, nama, kelas, no_telp, username, password } = req.body;

    // Validasi role
    if (!["guru", "murid"].includes(role)) {
      return res.status(400).json({ message: "Role harus 'guru' atau 'murid'" });
    }

    // Cek apakah username sudah digunakan
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = new User({
      role,
      NIP: role === "guru" ? NIP : undefined,
      NISN: role === "murid" ? NISN : undefined,
      nama,
      kelas: role === "murid" ? kelas : undefined,
      no_telp,
      username,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Username tidak ditemukan" });

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    res.status(200).json({
      message: "Login berhasil",
      user: {
        _id: user._id,
        role: user.role,
        nama: user.nama,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
