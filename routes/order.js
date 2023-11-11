const router = require("express").Router();
const {createOrder, updateStatusOrder, getOrderById} = require("../controllers/order/index");


router.post("/:id", createOrder);
// thêm router updateOrder (check đk status = 0)
// thêm router deleteOrder (check đk status = 0)
router.get("/:id", getOrderById)

// thêm router listOrderById (admin)
// thêm router getAllOrder  (admin)
router.put("/:id", updateStatusOrder)

module.exports = router;