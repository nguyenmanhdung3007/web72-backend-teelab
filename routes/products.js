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

// GET
// router.get("/", getProduct);
// router.get("/get-by-category", getProductByCategory);
router.get("/get-paging", getPagingProduct);
router.get("/:id", getProductById);
// POST
router.post("/create-category", createCategory);
router.post("/:id", createProduct);
router.post("/create-variant/:id", createVariant);

// DELETE
//router update
router.delete("/:id", deleteProduct);

module.exports = router;
