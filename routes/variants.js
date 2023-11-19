const router = require("express").Router();
const {
  createVariant,
  getVariantById,
  updateVariant,
  deleteVariant,
} = require("../controllers/variant");

router.get("/:id", getVariantById);
router.put("/:id", updateVariant);
router.delete("/:id", deleteVariant);
router.post("/create-variant/:id", createVariant);

module.exports = router;
