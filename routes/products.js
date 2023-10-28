const router = require("express").Router();
const createProduct = require('../controllers/products');

router.post('/', createProduct);

module.exports = router;