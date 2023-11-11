const router = require("express").Router();
const {
  createProduct,
  createCategory,
  createVariant,
  getProductById,
  getProduct,
  deleteProduct,
  getPagingProduct,
} = require("../controllers/product");

router.get("/", getProduct);
router.get("/:id", getProductById);
router.get('/get-paging', getPagingProduct)

router.post("/create-category", createCategory);
router.post("/:id", createProduct);
router.post("/create-variant/:id", createVariant);

//router update
router.delete("/:id", deleteProduct);


module.exports = router;
