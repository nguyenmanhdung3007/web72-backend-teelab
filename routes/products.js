const router = require("express").Router();
const {
  createProduct,
  createCategory,
  getProductById,
  getAllProductPaging,
  deleteProduct,
  getProductByCategory,
  updateProduct,
} = require("../controllers/product");

// GET
router.get("/get-all-paging", getAllProductPaging);
router.get("/get-by-category", getProductByCategory);
router.get("/:id", getProductById);
// POST
router.post("/create-category", createCategory);
router.post("/:id", createProduct);
// router.post("/create-variant/:id", createVariant);

router.put("/:id", updateProduct)

// DELETE
//router update
router.delete("/:id", deleteProduct);

module.exports = router;
