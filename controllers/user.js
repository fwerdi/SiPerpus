const User = require("../models/user.model");


exports.searchUser = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword pencarian tidak boleh kosong." });
    }

    const result = await User.find({
      $or: [
        { NISN: { $regex: keyword, $options: "i" } },
        { nama: { $regex: keyword, $options: "i" } },
        { kelas: { $regex: keyword, $options: "i" } },
        { alamat: { $regex: keyword, $options: "i" } },
        { no_telp: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mencari data", error: error.message });
  }
};

// GET All User
exports.getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE User
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

