const router = require("express").Router();
const {createOrder} = require("../controllers/order/index");


router.post("/:id", createOrder);

module.exports = router;