const router = require("express").Router();
const {createProduct, createCategory, createVariant, getProductById, getProduct, deleteProduct} = require('../controllers/product');

router.get("/", getProduct)
router.post('/create-category', createCategory);
router.get("/:id", getProductById)
// router.put('/:id', updateProduct)
router.delete("/:id", deleteProduct)
router.post('/:id', createProduct);
router.post('/create-variant/:id', createVariant);


module.exports = router;