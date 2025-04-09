const Admin = require("../models/admin.model");

// GET All Admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Admin
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Admin
exports.createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAdmin) return res.status(404).json({ message: "Admin tidak ditemukan" });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: "Admin tidak ditemukan" });
    res.status(200).json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.searchAdmin = async (req, res) => {
  try {
    const keyword = req.query.q;

    const result = await Admin.find({
      username: { $regex: keyword, $options: "i" },
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
