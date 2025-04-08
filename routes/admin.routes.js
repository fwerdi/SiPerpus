const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.get("/", AdminController.getAdmin);
router.get("/search", AdminController.searchAdmin);
router.get("/:id", AdminController.getAdminById);
router.post("/", AdminController.createAdmin);
router.put("/:id", AdminController.updateAdmin);
router.delete("/:id", AdminController.deleteAdmin);

module.exports = router