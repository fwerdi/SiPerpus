const express = require('express');
const router = express.Router();
const PeminjamanController = require('../controllers/peminjaman.js'); // Make sure path is correct

router.get("/search", PeminjamanController.searchPeminjaman);
router.get('/', PeminjamanController.getPeminjaman);
router.get('/:id', PeminjamanController.getPeminjamanById);
router.post('/', PeminjamanController.createPeminjaman);
router.put('/:id', PeminjamanController.updatePeminjaman);
router.delete('/:id', PeminjamanController.deletePeminjaman);

module.exports = router;