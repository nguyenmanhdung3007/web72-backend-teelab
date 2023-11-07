// const OrderModel = require('../../models/Order')
const orders = require('../../models/Order.js');

const productRevenue = async (req, res) => {
    try {
        const result = await orders.find({})
        console.log(result)
        return res.status(200).json(result)
    } catch (error) {

    }
}

module.exports = {
    productRevenue
}