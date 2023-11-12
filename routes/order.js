const router = require("express").Router();
const {
  createOrder,
  updateStatusOrder,
  getOrderById,
} = require("../controllers/order/index");
const { authentication } = require("../middlewares/authenticator");
const { authorization } = require("../middlewares/authorization");

router.post("/:id", createOrder);
// router.post("/:id", authentication, authorization, createOrder);
// thêm router updateOrder (check đk status = 0)
// thêm router deleteOrder (check đk status = 0)
router.get("/:id", getOrderById);

// thêm router listOrderById (admin)
// thêm router getAllOrder  (admin)
router.put("/:id", updateStatusOrder);

module.exports = router;
