// const OrderModel = require('../../models/Order')
const orderModel = require('../../models/Order.js');
const variantModel = require('../../models/Variant.js');

const getAllOrder = async (req, res) => { //tất cả order
    try {
        const result = await orderModel.find({})
        return res.status(200).json({
            order: result,
            countOrder: result.length
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const getOrdersToday = async (req, res) => {
    try {
        const allOrder = await orderModel.find({})
        const dayNow = new Date().getDate()
        const orderToday = [];

        for (const key in allOrder) {
            if (allOrder[key]?.createdAt.getDate() == dayNow) {
                orderToday.push(allOrder[key]);
            }
        }

         // ==============================
         const variantsValue = await variantModel.find({})
         // console.log(variantsValue)
         let sumTotal = 0;
 
 
         for (const value of orderToday) {
             const ListOrder = value.orderDetail
             const status = value?.status
 
             for (const variantItem of ListOrder) {
 
                 for (const value of variantsValue) {
                     //    console.log(value.id)
                     if (variantItem.variant == value.id && variantItem.quantity && status == 0) {
                         sumTotal += value.price * variantItem.quantity
                     }
                 }
 
             }
         }
         //==========================================

        return res.status(201).json({
            orderToday: orderToday,
            status: 'success',
            today: dayNow,
            sumTotal: sumTotal,
            countOrderToday: orderToday.length,

        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

const getOrderDate = async (req, res) => {
    try {
        const param = req.query
        const date = param.day;

        const allOrder = await orderModel.find({})
        const orderToday = [];

        for (const key in allOrder) {
            if (allOrder[key]?.createdAt.getDate() == date) {
                orderToday.push(allOrder[key]);
            }
        }

        // ==============================
        const variantsValue = await variantModel.find({})
        // console.log(variantsValue)
        let sumTotal = 0;


        for (const value of orderToday) {
            const ListOrder = value.orderDetail
            const status = value?.status

            for (const variantItem of ListOrder) {

                for (const value of variantsValue) {
                    //    console.log(value.id)
                    if (variantItem.variant == value.id && variantItem.quantity && status == 0) {
                        sumTotal += value.price * variantItem.quantity
                    }
                }

            }
        }
        //==========================================

        return res.status(201).json({
            orderToday: orderToday,
            status: 'success',
            date: date,
            countOrderToday: orderToday.length,
            sumTotal: sumTotal

        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

const getOrderMonth = async (req, res) => {
    try {
        const param = req.query
        let month = param.month;

        const date = new Date()
        if (!month) {
            month = date.getMonth() + 1;
        }
        const allOrder = await orderModel.find({})
        const orderMonth = [];


        for (const key in allOrder) {
            if (allOrder[key]?.createdAt.getMonth() + 1 == month) {
                orderMonth.push(allOrder[key]);
            }
        }

        //==================================
        const variantsValue = await variantModel.find({})
        // console.log(variantsValue)
        let sumTotal = 0;


        for (const value of orderMonth) {
            const ListOrder = value.orderDetail
            const status = value?.status

            for (const variantItem of ListOrder) {

                for (const value of variantsValue) {
                    //    console.log(value.id)
                    if (variantItem.variant == value.id && variantItem.quantity && status == 0) {
                        sumTotal += value.price * variantItem.quantity;
                    }
                }

            }
        }
        //====================

        return res.status(201).json({
            orderMonth: orderMonth,
            status: 'success',
            month: month,
            countOrderMonth: orderMonth.length,
            sumTotal: sumTotal
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

const getOrderYear = async (req, res) => {
    try {
        const param = req.query
        let year = param.year;
        const date = new Date()

        if (!year) {
            year = date.getFullYear();
        }
        const allOrder = await orderModel.find({})
        const orderYear = [];


        for (const key in allOrder) {
            if (allOrder[key]?.createdAt.getFullYear() == year) {
                orderYear.push(allOrder[key]);
            }
        }

        //================================
        const variantsValue = await variantModel.find({})
        // console.log(variantsValue)
        let sumTotal = 0;


        for (const value of orderYear) {
            const ListOrder = value.orderDetail
            const status = value?.status

            for (const variantItem of ListOrder) {

                for (const value of variantsValue) {
                    //    console.log(value.id)
                    if (variantItem.variant == value.id && variantItem.quantity && status == 0) {
                        sumTotal += value.price * variantItem.quantity
                    }
                }

            }
        }
        //=====================================

        return res.status(201).json({
            orderYear: orderYear,
            status: 'success',
            year: year,
            countOrderYear: orderYear.length,
            sumTotal: sumTotal
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}


module.exports = {
    getAllOrder,
    getOrdersToday,
    getOrderDate,
    getOrderMonth,
    getOrderYear
}