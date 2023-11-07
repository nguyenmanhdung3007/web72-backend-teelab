const router = require("express").Router();
const {
  createVariant,
  getVariantById,
  updateVariant,
  deleteVariant,
} = require("../controllers/product");

router.get("/:id", getVariantById);
router.put("/:id", updateVariant);
router.delete("/:id", deleteVariant);

module.exports = router;
