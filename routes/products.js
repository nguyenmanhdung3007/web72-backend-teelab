const router = require("express").Router();
const {
  createProduct,
  createCategory,
  createVariant,
  getProductById,
  getProduct,
  deleteProduct,
  getPagingProduct,
  getProductByCategory,
} = require("../controllers/product");

// router.get("/", getProduct);
router.get('/get-by-category', getProductByCategory)
router.get('/get-paging', getPagingProduct)
router.get("/:id", getProductById);

router.post("/create-category", createCategory);
router.post("/:id", createProduct);
router.post("/create-variant/:id", createVariant);

//router update
router.delete("/:id", deleteProduct);


module.exports = router;
