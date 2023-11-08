// const OrderModel = require('../../models/Order')
const orderModel = require('../../models/Order.js');

const productRevenue = async (req, res) => {
    try {
        const result = await orderModel.find({})
        console.log(result.length)
        return res.status(200).json({
            order: result,
            countOrder: result.length
        })
    } catch (error) {

    }
}

module.exports = {
    productRevenue
}